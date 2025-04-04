import Hero from '../components/landing-page/hero'
import Anthem from '@/components/landing-page/anthem'
import MaskSection from '@/components/landing-page/masksection'
import BlogSection from '@/components/landing-page/blog'
import StoreSection from '@/components/landing-page/storesection'
import Footer from '@/components/landing-page/footer'
import Header from '@/components/landing-page/header'
import RegionModal from '@/components/region/region-modal'

export default async function Home() {
  return (
    <div className="">
      <RegionModal />
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
