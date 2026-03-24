import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@iiskills/access', '@iiskills/hooks', '@iiskills/ui'],

  experimental: {
    serverActions: {
      allowedOrigins: [
        'learn-apt.iiskills.in',
        'localhost:3012',
      ],
    },
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'learn-apt.iiskills.in', pathname: '/**' },
      { protocol: 'https', hostname: 'octgncmruhsbrxpxrkzl.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
};

export default nextConfig;
