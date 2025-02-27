'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <motion.div
      id="hero"
      className="flex flex-col max-w-[1920px] bg-[url('/heroimage3.png')] bg-cover bg-center sm:bg-center lg:bg-left overflow-hidden px-4"
      initial={{ scale: 1.5, filter: 'blur(8px)' }}
      animate={{ scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <main className="flex flex-col items-center ">
        <div className="2xl:max-w-[1440px] lg:max-w-[1280px] w-full relative flex flex-col justify-between pt-20 pb-20 md:pt-28 md:pb-28 lg:pt-40 lg:pb-40 xl:pt-72 xl:pb-36 h-[100vh] lg:h-[120vh] xl:h-[160vh]">
          <Image
            className="mx-auto mt-6"
            src="/trademark.png"
            alt="Next.js logo"
            width={1440}
            height={244}
            priority
          />
          <div>
            <motion.p
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: -50 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.6 }}
              className="max-w-sm md:max-w-md lg:max-w-xl font-bergenregular uppercase
              lg:text-xl md:text-base text-sm tracking-wide"
            >
              Uma nova era começou. Ampliando a alquimia que faz parte da nossa
              essência, unimos corpo, mente e espírito nessa jornada de
              descoberta. Um lugar onde buscadores se conectam para sair da zona
              de conforto, encontrar novos caminhos da mente, expressar a alma
              sintonizada e colocar ainda mais intenção em seus rituais. Seja
              bem-vindo à Companhia da Tempestade de Ideias.
            </motion.p>
          </div>
        </div>
      </main>
    </motion.div>
  )
}
