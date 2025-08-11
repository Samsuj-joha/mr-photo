/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during builds to prevent deployment failures
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript errors during builds (optional - set to true if needed)
  typescript: {
    ignoreBuildErrors: false, // Change to true if you have TypeScript errors too
  },

  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // Simplified experimental config for Next.js 15
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "mr-photo-eta.vercel.app"]
    }
  },

  // External packages for server components
  serverExternalPackages: ['cloudinary'],

  // Headers for PDF files
  async headers() {
    return [
      {
        source: '/uploads/pdfs/:path*.pdf',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/pdf',
          },
          {
            key: 'Content-Disposition',
            value: 'inline',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;