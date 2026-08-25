import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const aiApiUrl = process.env.NEXT_PUBLIC_AI_API_URL || 'http://127.0.0.1:8000';
    return [
      {
        source: '/api/ai/:path*',
        destination: `${aiApiUrl}/api/ai/:path*`
      }
    ];
  }
};

export default nextConfig;
