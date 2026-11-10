import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { IMPORT_COUNTRIES, SITE_TAGLINE } from '@/data/site-copy'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.example.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `Autohub — Профессиональный импорт автомобилей из ${IMPORT_COUNTRIES}`,
  description: `${SITE_TAGLINE}. Импорт автомобилей из ${IMPORT_COUNTRIES} под ключ: подбор, проверка, таможня, доставка.`,
  keywords: ['импорт авто', 'авто из оаэ', 'авто из китая', 'автомобили под заказ', 'autohub'],
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: siteUrl,
    siteName: 'Autohub',
    title: `Autohub — импорт автомобилей из ${IMPORT_COUNTRIES}`,
    description: `${SITE_TAGLINE}. Подбор, проверка, таможня и доставка.`,
    images: [{ url: '/logo-horizontal.png', width: 1021, height: 174, alt: 'Autohub' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Autohub — импорт авто`,
    description: SITE_TAGLINE,
    images: ['/logo-horizontal.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#16161e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col"
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
