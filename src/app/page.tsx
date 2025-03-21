import Hero from '../components/landing-page/hero'
import Anthem from '@/components/landing-page/anthem'
import MaskSection from '@/components/landing-page/masksection'
import BlogSection from '@/components/landing-page/blog'
import StoreSection from '@/components/landing-page/storesection'
import Footer from '@/components/landing-page/footer'
import Header from '@/components/landing-page/header'

export default function Home() {
  return (
    <div className="">
      <Header />
      <Hero />
      <Anthem />
      <MaskSection />
      <BlogSection />
      <StoreSection />
      <Footer />
    </div>
  )
}
