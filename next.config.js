/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ⬅️ مهم: فعال‌سازی خروجی استاتیک
  eslint: {
    ignoreDuringBuilds: true, // ⬅️ حفظ تنظیم فعلی
  },
};

module.exports = nextConfig;