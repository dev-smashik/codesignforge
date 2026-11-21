import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a compact Node.js server bundle suitable for cPanel's
  // Application Manager. Runtime routes (including the subscription API)
  // remain enabled; this is not a static export.
  output: "standalone",
  poweredByHeader: false,
};

export default nextConfig;
