'use client'
import React from 'react'
import Button from '../ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'

export default function StoreSection() {
  return (
    <div className="2xl:max-w-[1440px] lg:max-w-[1280px] space-y-24 mx-auto w-full flex flex-col my-32 font-windsor text-brain-text px-4">
      {/* PARALLAX */}
      <div className="relative flex flex-col max-w-[1560px]">
        <motion.h1
          initial={{ opacity: 0, translateY: '100%' }}
          whileInView={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="lg:text-8xl md:text-7xl text-5xl lg:text-nowrap lg:text-left text-center mb-8 tracking-tight uppercase font-windsor flex"
        >
          Mente, corpo e alma
        </motion.h1>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: '105%' }}
          transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.3 }}
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-[1440px] h-[1px] bg-brain-border/20"
        />
      </div>

      <div className="lg:grid lg:grid-cols-2 flex flex-col items-center gap-12">
        {/* left side */}
        <div className="">
          <Image
            src={'/mush.png'}
            alt={''}
            width={302}
            height={382}
            className="mx-auto md:w-auto w-2/3"
          />
        </div>
        {/* right side */}
        <div className="flex flex-col gap-8 max-w-[640px] items-center lg:items-start">
          <motion.h1
            initial={{ opacity: 0, translateY: '100%' }}
            whileInView={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
            viewport={{ once: true, amount: 0.1 }}
            className="lg:text-7xl text-5xl text-center lg:text-left uppercase"
          >
            desvende seu caminho
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, translateY: '100%' }}
            whileInView={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.1 }}
            className="text-lg text-brain-text/60 text-center lg:text-left"
          >
            Acreditamos na magia da jornada. Por isso, incentivamos tanto que
            você mergulhe de cabeça na sua. Desvende as mensagens de cada
            produto da Brain CO e perceba a forma que cada uma se encaixa em
            algum momento da sua rotina. Explore nossas editorias, entregue-se
            aos seus rituais e abra espaço para o novo chegar. A expansão é o
            caminho.
          </motion.p>
          <div className="">
            <Link href={'/produtos'}>
              <Button>ver produtos</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
