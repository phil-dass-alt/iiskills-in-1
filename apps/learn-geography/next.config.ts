import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@iiskills/access', '@iiskills/content', '@iiskills/hooks', '@iiskills/ui'],

  experimental: {
    serverActions: {
      allowedOrigins: [
        'learn-geography.iiskills.in',
        'localhost:3007',
      ],
    },
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'learn-geography.iiskills.in', pathname: '/**' },
      { protocol: 'https', hostname: 'octgncmruhsbrxpxrkzl.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
};

export default nextConfig;
