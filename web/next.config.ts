import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Static export: the site is fully pre-rendered, so it deploys to any
     static host exactly like the prototypes did. */
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
