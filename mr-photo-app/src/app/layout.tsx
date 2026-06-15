// File: /src/app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ConditionalLayout } from '@/components/layout/ConditionalLayout'
import { NavigationProgress } from '@/components/layout/NavigationProgress'
import { NavigationListener } from '@/components/layout/NavigationListener'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mr-photography.com'),
  title: 'mr-photos',
  description: 'Professional photographer specializing in Birds, Wildlife & Landscape. Capturing the raw beauty of nature through stunning imagery.',
  keywords: 'bird photography, wildlife photography, landscape photography, nature photographer, professional photographer',
  authors: [{ name: 'Michael Rodriguez' }],
  creator: 'MR Photography',
  publisher: 'MR Photography',
  icons: {
    icon: [
      { url: '/images/logo.png', type: 'image/png' },
    ],
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'mr-photos',
    description: 'Professional photographer specializing in Birds, Wildlife & Landscape. Capturing the raw beauty of nature through stunning imagery.',
    url: 'https://mr-photography.com',
    siteName: 'MR Photography',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MR Photography - Professional Photography Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MR-PHOTOGRAPHY - Birds, Wildlife & Landscape Portfolio',
    description: 'Professional photographer specializing in Birds, Wildlife & Landscape.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <NavigationListener />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}