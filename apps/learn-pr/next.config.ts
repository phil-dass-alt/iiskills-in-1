import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@iiskills/access', '@iiskills/content', '@iiskills/hooks', '@iiskills/ui'],

  experimental: {
    serverActions: {
      allowedOrigins: [
        'learn-pr.iiskills.in',
        'localhost:3011',
      ],
    },
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'learn-pr.iiskills.in', pathname: '/**' },
      { protocol: 'https', hostname: 'octgncmruhsbrxpxrkzl.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
};

export default nextConfig;
