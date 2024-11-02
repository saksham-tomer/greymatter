/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { domains: ["images.unsplash.com","miro.medium.com","lh3.googleusercontent.com","avatars.githubusercontent.com"] },
  typescript: {
    ignoreBuildErrors: true,
  
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
