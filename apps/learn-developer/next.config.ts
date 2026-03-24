import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@iiskills/access', '@iiskills/content', '@iiskills/hooks', '@iiskills/ui'],

  experimental: {
    serverActions: {
      allowedOrigins: [
        'learn-developer.iiskills.in',
        'localhost:3006',
      ],
    },
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'learn-developer.iiskills.in', pathname: '/**' },
      { protocol: 'https', hostname: 'octgncmruhsbrxpxrkzl.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
};

export default nextConfig;
