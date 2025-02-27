'use client'
import Image from 'next/image'
import React from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

export default function Anthem() {
  const { scrollYProgress } = useScroll()
  const parallaxX = useTransform(scrollYProgress, [0, 1], [200, -1000])

  return (
    <div className="2xl:max-w-[1440px] lg:max-w-[1280px] overflow-hidden mx-auto w-full flex flex-col justify-center items-center space-y-10 md:space-y-28 mb-10 md:mb-40 mt-10 md:mt-20 px-4">
      {/* PARALLAX */}
      <div className="relative flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, translateY: '100%' }}
          whileInView={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          style={{ x: parallaxX }}
          className="2xl:text-[142px] xl:text-9xl md:text-8xl text-5xl text-nowrap leading-none font-windsor flex"
        >
          ENJOY THE JOURNEY
        </motion.h1>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '150%' }}
          transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.3 }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full h-[1px] bg-brain-border"
        />
      </div>

      <motion.div
        initial={{ scale: 0.7 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeIn' }}
        viewport={{ once: true, amount: 0.6 }}
        className="w-full flex justify-center items-center"
      >
        <Image
          src="/welcome.png"
          alt="anthem photo"
          width={570}
          height={1080}
          priority
          className="mt-10 flex justify-center items-center max-h-[870px] object-cover rounded-[50px] md:rounded-[100px]"
        />
      </motion.div>

      <div className="flex text-center z-10 absolute xl:max-w-[800px] w-4/5">
        <motion.p
          initial={{ opacity: 0, translateX: '-50%' }}
          whileInView={{ opacity: 1, translateX: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.5 }}
          className="uppercase text-brain-text font-windsor lg:text-7xl text-4xl md:text-5xl tracking-tight mt-20"
        >
          Alquimistas, quando se conectam,{' '}
          <span className="text-brain-span">
            têm o poder de estourar bolhas
          </span>
          , conectando ideias e pessoas. É sobre construir pontes.
        </motion.p>
      </div>
    </div>
  )
}
