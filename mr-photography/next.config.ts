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
  // Add PDF headers for inline viewing
  async headers() {
    return [
      {
        // Apply these headers to all PDF files in uploads
        source: '/uploads/pdfs/:path*.pdf',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/pdf',
          },
          {
            key: 'Content-Disposition',
            value: 'inline', // This ensures PDFs open in browser instead of downloading
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000', // Cache for 1 year
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig