import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/ai/:path*',
        destination: 'http://127.0.0.1:8000/api/ai/:path*'
      }
    ];
  }
};

export default nextConfig;
