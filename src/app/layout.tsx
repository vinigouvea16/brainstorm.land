import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Geist } from 'next/font/google'
import { CartProvider } from '@/contexts/cart-context'
import CartDrawer from '@/components/store-components/cart-drawer'

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
  title: 'Brainstorm',
  description:
    'Desvende a magia dos produtos Brain CO. e permita que eles elevem sua vida a um novo patamar de consciência e bem-estar. Explore nossas submarcas, abrace a jornada de autoconhecimento e seja parte de uma comunidade vibrante em busca da expansão da mente. Seu despertar começa agora!',
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
      </body>
    </html>
  )
}
