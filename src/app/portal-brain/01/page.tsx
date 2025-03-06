'use client'
import Footer from '@/components/landing-page/footer'
import BlogCard from '@/components/ui/blog-card'
import Button from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

export default function PostPage() {
  const { scrollYProgress } = useScroll()
  const parallaxX = useTransform(scrollYProgress, [0, 1], [-300, 400])
  const parallaxX2 = useTransform(scrollYProgress, [0, 1], [200, -200])

  return (
    <main className="">
      <div className="relative xl:h-[80vh] h-[60vh]" id="hero">
        <Image
          src="/blogpageimghero.jpg"
          alt="blog page hero img"
          fill
          className="object-cover opacity-45"
        />
        <div className="absolute inset-x-0 bottom-0">
          <div className="2xl:max-w-[1440px] lg:max-w-[1280px] 2xl:px-12 xl:px-0 px-4 mx-auto">
            <h1 className="font-windsor text-brain-text md:text-8xl text-5xl mb-12 leading-none text-left tracking-tight">
              Cordyceps Sinensis: O Aliado Natural para Energia, Imunidade e
              Libido
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-[920px] mx-auto my-40 flex h-[200vh] lg:px-0 px-4">
        <p className="font-bergenregular lg:text-lg max-w-[640px] uppercase opacity-80">
          Bem-vindo ao blog da Brainstorm, um espaço dedicado ao despertar da
          mente e da alma. Nossos artigos e conteúdos são cuidadosamente criados
          para inspirar e guiar você em uma jornada de crescimento pessoal e
          transformação
        </p>
      </div>

      <div className="2xl:max-w-[1440px] lg:max-w-[1280px] mx-auto w-full flex flex-col lg:py-32 lg:pb-16 pt-20 overflow-hidden px-4">
        {/* PARALLAX */}
        <div className="relative flex flex-col max-w-[1440px] items-center uppercase h-52">
          <motion.h1
            initial={{ opacity: 0, translateY: '50%' }}
            whileInView={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
            viewport={{ once: true, amount: 0.3 }}
            style={{ x: parallaxX }}
            className="xl:text-9xl md:text-8xl text-5xl text-nowrap leading-none font-windsor flex"
          >
            posts
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, translateY: '50%' }}
            whileInView={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
            viewport={{ once: true, amount: 0.2 }}
            style={{ x: parallaxX2 }}
            className="xl:text-9xl md:text-8xl text-5xl text-nowrap font-windsor flex"
          >
            relacionados
          </motion.h2>
        </div>

        <div className="flex lg:flex-row flex-col justify-center space-y-8 md:space-y-0 gap-4 mb-24 mx-auto ">
          {/* card 1 */}
          <BlogCard
            backgroundImage="/cardlandingpage.jpeg"
            className="mt-12"
            href="/portal-brain"
          >
            Cordyceps Sinensis: O Aliado Natural para Energia, Imunidade e
            Libido
          </BlogCard>

          {/* card 2 */}
          <BlogCard
            backgroundImage="/card2landingpage.png"
            href="/portal-brain"
          >
            A Rede Neuroquímica da Natureza tem Muito a nos Ensinar
          </BlogCard>
        </div>

        <div className="flex justify-center items-start mb-40">
          <Link href="/portal-brain">
            <Button>ver todos</Button>
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
