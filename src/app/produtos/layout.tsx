import type React from 'react'
import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Portal Brain | Brainstorm',
  description: 'descriçao blog',
}

export default function LayoutProdutos({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
