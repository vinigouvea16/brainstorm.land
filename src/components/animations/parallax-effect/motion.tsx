'use client'

import React from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

interface ParallaxHeaderProps {
  title1?: string
  title2?: string
  parallaxValues?: {
    x1: [number, number]
    x2: [number, number]
  }
}

export default function ParallaxHeader({
  title1 = 'posts',
  title2 = 'relacionados',
  parallaxValues = { x1: [-300, 400], x2: [200, -200] }, // Valores padrão
}: ParallaxHeaderProps) {
  const { scrollYProgress } = useScroll()
  const parallaxX = useTransform(scrollYProgress, [0, 1], parallaxValues.x1)
  const parallaxX2 = useTransform(scrollYProgress, [0, 1], parallaxValues.x2)

  return (
    <div className="relative flex flex-col max-w-[1440px] items-center uppercase h-52">
      <motion.h1
        initial={{ opacity: 0, translateY: '50%' }}
        whileInView={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
        viewport={{ once: true, amount: 0.3 }}
        style={{ x: parallaxX }}
        className="xl:text-9xl md:text-8xl text-5xl text-nowrap leading-none font-windsor flex"
      >
        {title1}
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0, translateY: '50%' }}
        whileInView={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.5 }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ x: parallaxX2 }}
        className="xl:text-9xl md:text-8xl text-5xl text-nowrap font-windsor flex"
      >
        {title2}
      </motion.h2>
    </div>
  )
}
