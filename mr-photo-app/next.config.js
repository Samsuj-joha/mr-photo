/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    // Disable image optimization for Azure App Service compatibility
    // Azure App Service may have issues with Next.js image optimization API
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'mr-photos.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.mr-photos.com',
        pathname: '/**',
      },
      // Allow any Azure blob storage or CDN URLs
      {
        protocol: 'https',
        hostname: '**.blob.core.windows.net',
        pathname: '/**',
      },
    ],
  },

  experimental: {
    serverActions: {
      allowedOrigins: ['*']
    },
    largePageDataBytes: 128 * 100000,
  },

  serverExternalPackages: ['cloudinary'],

  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },

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

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.mr-photos.com',
          },
        ],
        destination: 'https://mr-photos.com/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

