import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 
   * STRICT BUILD MODE ENABLED
   * Using default strict checks.
   */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
