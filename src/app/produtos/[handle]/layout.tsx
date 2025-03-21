import type React from 'react'
import type { Metadata } from 'next'
import '../../globals.css'
import HeaderStore from '@/components/store-components/header'
import Footer from '@/components/landing-page/footer'

export const metadata: Metadata = {
  title: 'Brain Co. Store',
  description: 'Loja oficial da Brain Co.',
}

export default function ProductHandleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <HeaderStore />
      {children}

      <Footer />
    </div>
  )
}
