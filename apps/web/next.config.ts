import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@iiskills/access', '@iiskills/content', '@iiskills/hooks'],
};

export default nextConfig;
