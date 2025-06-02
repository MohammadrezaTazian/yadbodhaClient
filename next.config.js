/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // نادیده گرفتن خطاهای eslint هنگام ساخت پروژه
  },
  reactStrictMode: false,
};

module.exports = nextConfig;