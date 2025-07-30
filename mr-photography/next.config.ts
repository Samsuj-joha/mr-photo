// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['cloudinary'],
    largePageDataBytes: 128 * 100000, // ~12.8MB for large uploads
  },
  // Allow large file uploads
  api: {
    bodyParser: {
      sizeLimit: '100mb', // Increase from default 1mb to 100mb
    },
    responseLimit: false,
  },
  // Increase serverless function timeout
  serverRuntimeConfig: {
    maxDuration: 300, // 5 minutes
  },
}

module.exports = nextConfig