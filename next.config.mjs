import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Next 16 removed images.domains in favor of remotePatterns.
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  // PostHog's endpoints use trailing slashes (/e/, /flags/, /s/). Without this, Next
  // issues a 308 to the slashless form before the rewrite runs and ingest breaks.
  // Required by PostHog's documented Next.js proxy setup.
  //
  // SIDE EFFECT worth knowing: this disables Next's automatic trailing-slash redirect
  // for EVERY route, not just /ingest. So /about/ no longer 308s to /about and both
  // forms become reachable. Every page here builds its metadata through
  // lib/seo.ts (getPageMetadata / getBlogMetadata), which always emits an absolute
  // `alternates.canonical` — that is what keeps search engines pointed at one form.
  // Verify those survive any future metadata refactor. See the witus repo's plans/26.
  skipTrailingSlashRedirect: true,

  async rewrites() {
    // Reverse-proxy PostHog through our own origin. us.i.posthog.com is on uBlock
    // Origin, Brave Shields, and Safari's tracker list, so a meaningful share of
    // events never leave the browser — including, reliably, our own test visits.
    // Routing ingest through brandanthonymcdonald.com leaves blockers nothing to
    // match on.
    //
    // Assets come from a different upstream host than ingest, hence two rules. The
    // more specific /static rule must come first.
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        // The Penn Relays recap migrated to a new slug; preserve any old
        // inbound/social links to the original (now-orphaned) slug.
        source: '/blog/penn-relays-2026-masters-sprint-results',
        destination: '/blog/penn-relays-2026-masters-50-plus-sprints',
        permanent: true,
      },
    ]
  },
  // Next 16 defaults to Turbopack, which resolves Node built-ins for client
  // bundles automatically — the old webpack `resolve.fallback` block is no
  // longer needed. Empty turbopack config opts in explicitly.
  turbopack: {},
};

// Wrap with Sentry's build plugin so errors report to Better Stack (which ingests over the Sentry
// protocol). Safe with no Sentry env set: without SENTRY_AUTH_TOKEN it just skips source-map upload,
// so you get minified stack traces instead of a failed build, and the runtime SDK stays inert without
// a DSN. org/project/authToken all come from env, so nothing secret is committed here.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  // Drops the SDK's own debug logging from the bundle. NOTE: this option is webpack-only and
  // therefore a no-op while this app builds with Turbopack (see `turbopack: {}` above). It is set
  // because it is the correct, non-deprecated key (`disableLogger` is deprecated in favor of it) and
  // it starts working the moment the build path changes.
  webpack: { treeshake: { removeDebugLogging: true } },
});
