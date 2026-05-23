import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://7483-2401-4900-1cb4-bb16-a4af-79e7-c35b-3278.ngrok-free.app/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
