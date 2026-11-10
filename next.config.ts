import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    // Old project URLs from the first version of the site
    return [{ source: "/projects/:slug", destination: "/work/:slug", permanent: true }];
  },
};

export default nextConfig;
