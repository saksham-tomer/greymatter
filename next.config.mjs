/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ["images.unsplash.com"] },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
