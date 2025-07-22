import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    disableStaticImages: true,
    domains: ['nws-server.s3.ap-southeast-1.amazonaws.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
        port: '',
        pathname: '/**',
      },

      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
