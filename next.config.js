/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'restaurant-ai-xi-dun.vercel.app'],
  },
  serverExternalPackages: ['sharp', 'canvas']
}

module.exports = nextConfig
