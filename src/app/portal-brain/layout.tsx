import type React from 'react'
import type { Metadata } from 'next'
import '../globals.css'
import Header from '@/components/landing-page/header'

export const metadata: Metadata = {
  title: 'Portal Brain | Brainstorm',
  description: 'descriçao blog',
}

export default function PortalBrainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      <Header />
      {children}
    </section>
  )
}
