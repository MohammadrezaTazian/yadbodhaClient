/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // فعال‌سازی خروجی استاتیک
  eslint: {
    ignoreDuringBuilds: true, // نادیده گرفتن خطاهای eslint هنگام ساخت پروژه
  },
  reactStrictMode: false,
};

module.exports = nextConfig;