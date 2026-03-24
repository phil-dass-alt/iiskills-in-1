import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@iiskills/access', '@iiskills/hooks'],

  experimental: {
    serverActions: {
      // Only allow Server Actions from the iiskills.in origin family
      allowedOrigins: [
        'iiskills.in',
        'www.iiskills.in',
        // Local development
        'localhost:3000',
        'localhost:3001',
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
