/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Next 16 removed images.domains in favor of remotePatterns.
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
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
      {
        // The blog listing moved to /blog/legacy. Exact match — individual posts
        // at /blog/<slug> are NOT affected.
        source: '/blog',
        destination: '/blog/legacy',
        permanent: true,
      },
    ]
  },
  // Next 16 defaults to Turbopack, which resolves Node built-ins for client
  // bundles automatically — the old webpack `resolve.fallback` block is no
  // longer needed. Empty turbopack config opts in explicitly.
  turbopack: {},
};

export default nextConfig;
