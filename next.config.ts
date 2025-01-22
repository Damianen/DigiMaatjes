// next.config.ts
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['studententuin.com', '*.studententuin.nl'],
      bodySizeLimit: '5mb'
    },
  },
};

export default nextConfig;
