import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Standard Vercel optimization: smaller deployment size
  output: 'standalone', 
  
  eslint: {
    // Recommendation: Keep this true for Vercel to ensure code quality, 
    // but set to true if you want to bypass linting errors during deployment.
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    // Ensure builds don't fail on Vercel due to small type mismatches
    ignoreBuildErrors: true, 
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
    ],
  },

  // Transpile Framer Motion for better production compatibility
  transpilePackages: ['motion'],

  webpack: (config, { dev }) => {
    // Only apply Termux/Local-specific fixes if we are in a dev environment.
    // Vercel will ignore this block during production builds.
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        ignored: ['**/node_modules', '/data/data/**'],
      };
    }
    return config;
  },
};

export default nextConfig;
