'use client'
import React from 'react'
import Button from '../ui/button'
import BlogCard from '../ui/blog-card'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'motion/react'

export default function BlogSection() {
  const { scrollYProgress } = useScroll()
  const parallaxX = useTransform(scrollYProgress, [0, 1], [-300, 400])
  const parallaxX2 = useTransform(scrollYProgress, [0, 1], [200, -200])

  return (
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
          Informação
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, translateY: '50%' }}
          whileInView={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
          viewport={{ once: true, amount: 0.2 }}
          style={{ x: parallaxX2 }}
          className="xl:text-9xl md:text-8xl text-5xl text-nowrap font-windsor flex"
        >
          aos buscadores
        </motion.h2>
      </div>

      <div className="flex lg:flex-row flex-col justify-center space-y-8 md:space-y-0 gap-4 mb-24 mx-auto ">
        {/* card 1 */}
        <BlogCard backgroundImage="/cardlandingpage.jpeg" className="mt-12">
          Cordyceps Sinensis: O Aliado Natural para Energia, Imunidade e Libido
        </BlogCard>

        {/* card 2 */}
        <BlogCard backgroundImage="/card2landingpage.png">
          A Rede Neuroquímica da Natureza tem Muito a nos Ensinar
        </BlogCard>
      </div>

      <div className="flex justify-center items-start lg:mb-32 mb-16">
        <Link href="/portal-brain">
          <Button>ver blog</Button>
        </Link>
      </div>

      <div className="text-left max-w-[660px]">
        <p className="font-bergenregular lg:text-xl md:text-base uppercase text-brain-text">
          O equilíbrio físico, mental e espiritual impulsiona a clareza de
          pensamento, foco e desempenho cognitivo. Não se engane: não estamos
          falando apenas de produtividade. Em um mundo hiperativo, precisamos
          entender quando é o momento de acalmar a mente, ter insights profundos
          e despertar para o Eu Interior. Somos do time do espírito curioso e da
          alma que busca.
        </p>
      </div>
    </div>
  )
}
