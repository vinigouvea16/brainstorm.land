import Hero from '../components/landing-page/hero'
import Anthem from '@/components/landing-page/anthem'
import MaskSection from '@/components/landing-page/masksection'
import BlogSection from '@/components/landing-page/blog'
import StoreSection from '@/components/landing-page/storesection'
import Footer from '@/components/landing-page/footer'

export default function Home() {
  return (
    <div className="">
      <Hero />
      <Anthem />
      <MaskSection />
      <BlogSection />
      <StoreSection />
      <Footer />
    </div>
  )
}
