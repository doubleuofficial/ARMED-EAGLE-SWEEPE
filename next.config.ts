import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Best practice for Vercel and standalone deployments
  output: 'standalone',

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
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

  // Transpile Framer Motion for better SSR performance
  transpilePackages: ['motion'],

  experimental: {
    // Optimization: Fixes 'Big Strings' warnings by tree-shaking these heavy libraries
    optimizePackageImports: [
      'lucide-react', 
      'recharts', 
      'motion', 
      '@otplib/core'
    ],
  },

  webpack: (config, { dev }) => {
    // Termux/Local Dev Fix: Stops EACCES errors on Android
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        ignored: [
          '**/node_modules/**',
          '**/.next/**',
          '/data/**',
          '/'
        ],
      };
    }
    return config;
  },
};

export default nextConfig;
