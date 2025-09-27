// File: /src/app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { ConditionalLayout } from '@/components/layout/ConditionalLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MR-PHOTOGRAPHY - Professional Photography Portfolio',
  description: 'Capturing life\'s precious moments through professional photography. Wedding, portrait, and event photography services.',
  keywords: 'photography, wedding photography, portrait photography, professional photographer, New York photographer',
  authors: [{ name: 'Michael Rodriguez' }],
  creator: 'MR Photography',
  publisher: 'MR Photography',
  openGraph: {
    title: 'MR-PHOTOGRAPHY - Professional Photography Portfolio',
    description: 'Professional photographer specializing in weddings, portraits, and events. Creating timeless memories through beautiful imagery.',
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
    title: 'MR-PHOTOGRAPHY - Professional Photography Portfolio',
    description: 'Professional photographer specializing in weddings, portraits, and events.',
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