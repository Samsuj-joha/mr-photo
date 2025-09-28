// // /** @type {import('next').NextConfig} */
// // const nextConfig = {
// //   // Force disable ALL error checking for deployment
// //   eslint: {
// //     ignoreDuringBuilds: true,
// //   },
  
// //   // Ignore ALL TypeScript errors during build
// //   typescript: {
// //     ignoreBuildErrors: true,
// //   },

// //   // Disable type checking completely
// //   swcMinify: false,

// //   images: {
// //     domains: ['res.cloudinary.com', 'images.unsplash.com'],
// //     formats: ['image/webp', 'image/avif'],
// //     remotePatterns: [
// //       {
// //         protocol: 'https',
// //         hostname: 'res.cloudinary.com',
// //       },
// //       {
// //         protocol: 'https',
// //         hostname: 'images.unsplash.com',
// //       },
// //     ],
// //   },

// //   // Simplified experimental config
// //   experimental: {
// //     serverActions: {
// //       allowedOrigins: ["localhost:3000", "mr-photo-eta.vercel.app"]
// //     }
// //   },

// //   // External packages
// //   serverExternalPackages: ['cloudinary'],

// //   // Headers
// //   async headers() {
// //     return [
// //       {
// //         source: '/uploads/pdfs/:path*.pdf',
// //         headers: [
// //           {
// //             key: 'Content-Type',
// //             value: 'application/pdf',
// //           },
// //           {
// //             key: 'Content-Disposition',
// //             value: 'inline',
// //           },
// //           {
// //             key: 'Cache-Control',
// //             value: 'public, max-age=31536000',
// //           },
// //           {
// //             key: 'X-Content-Type-Options',
// //             value: 'nosniff',
// //           },
// //         ],
// //       },
// //     ];
// //   },
// // };

// // module.exports = nextConfig;




// // /** @type {import('next').NextConfig} */
// // const nextConfig = {
// //   // Remove output: 'standalone' line
  
// //   eslint: {
// //     ignoreDuringBuilds: true,
// //   },
// //   typescript: {
// //     ignoreBuildErrors: true,
// //   },

// //   images: {
// //     domains: ['res.cloudinary.com', 'images.unsplash.com'],
// //     formats: ['image/webp', 'image/avif'],
// //     remotePatterns: [
// //       {
// //         protocol: 'https',
// //         hostname: 'res.cloudinary.com',
// //       },
// //       {
// //         protocol: 'https',
// //         hostname: 'images.unsplash.com',
// //       },
// //     ],
// //   },

// //   experimental: {
// //     serverActions: true,
// //     largePageDataBytes: 128 * 100000,
// //   },

// //   serverExternalPackages: ['cloudinary'],

// //   env: {
// //     NEXTAUTH_URL: process.env.NEXTAUTH_URL,
// //     NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
// //   },

// //   async headers() {
// //     return [
// //       {
// //         source: '/uploads/pdfs/:path*.pdf',
// //         headers: [
// //           {
// //             key: 'Content-Type',
// //             value: 'application/pdf',
// //           },
// //           {
// //             key: 'Content-Disposition',
// //             value: 'inline',
// //           },
// //           {
// //             key: 'Cache-Control',
// //             value: 'public, max-age=31536000',
// //           },
// //           {
// //             key: 'X-Content-Type-Options',
// //             value: 'nosniff',
// //           },
// //         ],
// //       },
// //     ];
// //   },
// // };

// // module.exports = nextConfig;





// import type { NextConfig } from 'next'

// const nextConfig: NextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },

//   images: {
//     domains: ['res.cloudinary.com', 'images.unsplash.com'],
//     formats: ['image/webp', 'image/avif'],
//     remotePatterns: [
//       { protocol: 'https', hostname: 'res.cloudinary.com' },
//       { protocol: 'https', hostname: 'images.unsplash.com' },
//     ],
//   },

//   experimental: {
//     serverActions: {}, // ✅ must be an object
//     largePageDataBytes: 128 * 100000,
//   },

//   serverExternalPackages: ['cloudinary'],

//   env: {
//     NEXTAUTH_URL: process.env.NEXTAUTH_URL,
//     NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
//   },

//   async headers() {
//     return [
//       {
//         source: '/uploads/pdfs/:path*.pdf',
//         headers: [
//           { key: 'Content-Type', value: 'application/pdf' },
//           { key: 'Content-Disposition', value: 'inline' },
//           { key: 'Cache-Control', value: 'public, max-age=31536000' },
//           { key: 'X-Content-Type-Options', value: 'nosniff' },
//         ],
//       },
//     ]
//   },
// }

// export default nextConfig




import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },

  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.azurewebsites.net"],
      bodySizeLimit: '2mb'
    }, // ✅ Fixed: Now an object instead of boolean
    largePageDataBytes: 128 * 100000,
  },

  serverExternalPackages: ['cloudinary'],

  // Output standalone for better Azure deployment
  output: 'standalone',

  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },

  async headers() {
    return [
      {
        source: '/uploads/pdfs/:path*.pdf',
        headers: [
          { key: 'Content-Type', value: 'application/pdf' },
          { key: 'Content-Disposition', value: 'inline' },
          { key: 'Cache-Control', value: 'public, max-age=31536000' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig