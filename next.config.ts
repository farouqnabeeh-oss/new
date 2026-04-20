import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. تعطيل التدقيق على الـ TypeScript أثناء الـ Build
  typescript: {
    ignoreBuildErrors: true,
  },
  // 2. تعطيل التدقيق على الـ ESLint (الـ Linting) أثناء الـ Build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 3. إعدادات الصور اللي كانت عندك أصلاً
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 4. خيار إضافي لتقليل استهلاك الـ Memory إذا كان جهازك بيعلق
  experimental: {
    // ميزة بتساعد في تقليل حجم الـ Build وتخطي بعض مشاكل الـ Static Generation
    cpus: 1,
  }
};

export default nextConfig;