import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // 🔥 REQUIRED
  },
};

export default nextConfig;
