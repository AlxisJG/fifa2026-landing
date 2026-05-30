import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "10028"
      },
      {
        protocol: "https",
        hostname: "piodeportes.com"
      },
      {
        protocol: "https",
        hostname: "www.piodeportes.com"
      },
      {
        protocol: "https",
        hostname: "cdn.sportmonks.com"
      }
    ]
  }
};

export default nextConfig;
