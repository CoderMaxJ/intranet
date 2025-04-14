import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    // Remove all console logs including errors in production
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
