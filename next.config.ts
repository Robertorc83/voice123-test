import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['v1-media.s3.amazonaws.com', 'another-domain.amazonaws.com'],
  },
};

export default nextConfig;
