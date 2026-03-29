import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.weatherapi.com",
      },
    ],
  },
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;
