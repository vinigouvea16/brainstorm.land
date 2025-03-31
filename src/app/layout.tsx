import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Geist } from 'next/font/google'
import { CartProvider } from '@/contexts/cart-context'
import CartDrawer from '@/components/store-components/cart-drawer'
import { GoogleAnalytics } from '@next/third-parties/google'
import GA4Events from '@/components/analytics/ga4-events'
import { Suspense } from 'react'
import SearchParamsTracker from '@/components/analytics/search-params-tracker'

const geist = Geist({
  subsets: ['latin'],
})

const albra = localFont({
  src: '../../public/fonts/Albra-400.otf',
  variable: '--font-albra',
})

const bergenRegular = localFont({
  src: '../../public/fonts/Bergen-Mono-400.otf',
  variable: '--font-bergen-regular',
})

const bergenSemibold = localFont({
  src: '../../public/fonts/Bergen-Mono-600.otf',
  variable: '--font-bergen-semibold',
})

const windsorPro = localFont({
  src: '../../public/fonts/Windsor-Pro-400.ttf',
  variable: '--font-windsor-pro',
})

export const metadata: Metadata = {
  title: 'Home | Brainstorm',
  description:
    'Brainstorm conecta você a um novo patamar de consciência e bem-estar. Descubra nossas submarcas e faça parte de uma comunidade vibrante em busca do autoconhecimento.',
  keywords: [
    'Brainstorm',
    'autoconhecimento',
    'expansão da mente',
    'bem-estar',
    'produtos naturais',
  ],
  openGraph: {
    title: 'Home | Brainstorm',
    description:
      'Brainstorm conecta você a um novo patamar de consciência e bem-estar.',
    url: 'https://brainstorm-land.vercel.app/',
    siteName: 'Brainstorm',
    images: [
      {
        url: 'https://brainstorm-land.vercel.app/metadatabrainstorm.png',
        width: 1200,
        height: 630,
        alt: 'Brainstorm - Expansão da Consciência',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brainstorm | Expansão da Consciência',
    description:
      'Brainstorm conecta você a um novo patamar de consciência e bem-estar.',
    images: ['https://brainstorm-land.vercel.app/metadatabrainstorm.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${albra.variable} ${bergenRegular.variable} ${bergenSemibold.variable} ${windsorPro.variable} ${geist.className} antialiased text-brain-text bg-[#05060b]`}
      >
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
            <GA4Events />
            <Suspense fallback={null}>
              <SearchParamsTracker />
            </Suspense>
          </>
        )}
      </body>
    </html>
  )
}
