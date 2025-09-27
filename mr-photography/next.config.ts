// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // Force disable ALL error checking for deployment
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
  
//   // Ignore ALL TypeScript errors during build
//   typescript: {
//     ignoreBuildErrors: true,
//   },

//   // Disable type checking completely
//   swcMinify: false,

//   images: {
//     domains: ['res.cloudinary.com', 'images.unsplash.com'],
//     formats: ['image/webp', 'image/avif'],
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'res.cloudinary.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'images.unsplash.com',
//       },
//     ],
//   },

//   // Simplified experimental config
//   experimental: {
//     serverActions: {
//       allowedOrigins: ["localhost:3000", "mr-photo-eta.vercel.app"]
//     }
//   },

//   // External packages
//   serverExternalPackages: ['cloudinary'],

//   // Headers
//   async headers() {
//     return [
//       {
//         source: '/uploads/pdfs/:path*.pdf',
//         headers: [
//           {
//             key: 'Content-Type',
//             value: 'application/pdf',
//           },
//           {
//             key: 'Content-Disposition',
//             value: 'inline',
//           },
//           {
//             key: 'Cache-Control',
//             value: 'public, max-age=31536000',
//           },
//           {
//             key: 'X-Content-Type-Options',
//             value: 'nosniff',
//           },
//         ],
//       },
//     ];
//   },
// };

// module.exports = nextConfig;





/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Azure App Service
  output: 'standalone',
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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

  experimental: {
    serverActions: true,
    largePageDataBytes: 128 * 100000,
  },

  // Moved outside experimental section
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
};

module.exports = nextConfig;