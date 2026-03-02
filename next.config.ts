import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Next.js config options */
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
