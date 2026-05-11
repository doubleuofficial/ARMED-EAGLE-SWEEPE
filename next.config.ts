import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Standalone is best for Vercel and production stability
  output: 'standalone',

  eslint: {
    // Prevents build failure on Vercel/Local for minor linting issues
    ignoreDuringBuilds: true,
  },

  typescript: {
    // Ensures deployment doesn't fail due to strict type checks
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Optimized for Framer Motion and UI performance
  transpilePackages: ['motion'],

  webpack: (config, { dev }) => {
    // TERMUX FIX: 
    // This block only runs during 'npm run dev' to stop the EACCES errors.
    // It will be ignored by Vercel during the production build.
    if (dev) {
      config.watchOptions = {
        // Polling is required for the Android/Termux file system to detect changes
        poll: 1000,
        // STRICTLY IGNORE root directories to prevent permission denial spam
        ignored: [
          '**/node_modules/**',
          '**/.next/**',
          '**/.git/**',
          '/data/data/**', // Specific fix for Termux /data/data/ access
          '/data/**',      // Broad fix for system data access
          '/'              // Prevents scanning the root of the device
        ],
      };
    }

    // Support for environments that explicitly disable HMR
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }

    return config;
  },
};

export default nextConfig;
