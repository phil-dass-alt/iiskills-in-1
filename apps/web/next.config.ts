import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@iiskills/access', '@iiskills/content', '@iiskills/hooks', '@iiskills/ui'],

  experimental: {
    serverActions: {
      // Only allow Server Actions from the iiskills.in origin family
      allowedOrigins: [
        'admin.iiskills.in',
        'localhost:3040',
      ],
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iiskills.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.iiskills.in',
        pathname: '/**',
      },
      // Supabase storage bucket for iiskills project
      {
        protocol: 'https',
        hostname: 'octgncmruhsbrxpxrkzl.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
