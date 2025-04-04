import '../globals.css'
import Header from '@/components/landing-page/header'

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
