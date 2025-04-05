import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // wildcard to allow all hosts
      },
    ],
  },
};

export default nextConfig;
