import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.fifa.piodeportes.com" }],
        destination: "https://fifa.piodeportes.com/:path*",
        permanent: true
      }
    ];
  },
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
      },
      {
        protocol: "https",
        hostname: "piodeportes.s3.us-east-2.amazonaws.com"
      }
    ]
  }
};

export default nextConfig;
