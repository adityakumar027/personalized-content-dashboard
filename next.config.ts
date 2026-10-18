import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: "/personalized-content-dashboard",
  assetPrefix: "/personalized-content-dashboard",
};

export default nextConfig;
