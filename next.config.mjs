/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        'child_process': false,
        'fs/promises': false,
      };
    }
    return config;
  },
};

export default nextConfig;
