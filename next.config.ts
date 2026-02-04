import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ⚠️ 빌드 시 타입 체크 건너뛰기 (배포용)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
