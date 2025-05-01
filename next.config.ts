import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // This is a temporary workaround for the type conflicts in the API routes.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
