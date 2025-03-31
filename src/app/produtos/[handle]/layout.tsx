import type React from 'react'
import '../../globals.css'
import HeaderStore from '@/components/store-components/header'
import Footer from '@/components/landing-page/footer'

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
