'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Button from '../ui/button'
import Link from 'next/link'
import Image from 'next/image'

export default function MaskSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const maskScale = useTransform(scrollYProgress, [0.33, 1], [0, 4])
  const imageMotionY = useTransform(scrollYProgress, [0.35, 0.8], [-100, 1000])

  return (
    <motion.div
      ref={ref}
      className="relative w-full overflow-hidden h-[200vh] flex flex-col justify-center items-center text-brain-text lg:gap-0"
    >
      {/* mask */}
      <motion.div
        style={{ scale: maskScale }}
        className="absolute 2xl:-top-[22%] xl:-top-[18%] lg:-top-[35%] -top-[45%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#20221B] origin-center z-0 2xl:w-[70vw] xl:w-[80vw] lg:w-[120vw] md:w-[160vw] w-[400vw] aspect-square"
      />

      {/* content container */}
      <div className="relative z-20 flex flex-col space-y-20 my-20 w-full max-w-[1200px] mx-auto">
        {/* central line */}
        <div className="absolute left-1/2 top-0 h-full w-[2px] bg-brain-border/10 z-10" />

        {/* animated image */}
        <div className="relative">
          <motion.div
            style={{ y: imageMotionY }}
            className="absolute xl:left-[41%] md:left-[40%] left-1/4 transform -translate-x-1/2 z-20"
          >
            <Image
              src="/triadeBRAIN.png"
              alt="Descrição da imagem"
              width={216}
              height={79}
              priority
            />
          </motion.div>
        </div>

        <CustomSection
          title="Para vestir"
          subtitle="sua expressão"
          imageUrl="/triade1.png"
          imageAlt="triade1 logo"
          imageWidth={113}
          imageHeight={74}
          description="Se roupa é sua voz no mundo, Brain.Clothing é uma ferramenta de expressão. Nossas peças são agênero, ou seja, para todes."
          index="01"
        />

        <CustomSection
          title="Para nutrir"
          subtitle="mente e rotina"
          imageUrl="/triade2.png"
          imageAlt="triade2 logo"
          imageWidth={90}
          imageHeight={94}
          description="Desfrute de um cérebro mais responsivo e nutrido com super alimentos, cogumelos funcionais e microdosagem. Suas sinapses neurais vão agradecer por esse incentivo limpo e natural."
          index="02"
        />

        <CustomSection
          title="Para elevar"
          subtitle="seus rituais"
          imageUrl="/triade3.png"
          imageAlt="triade3 logo"
          imageWidth={90}
          imageHeight={94}
          description="Buscadores, aqui é onde vive o elixir para os seus rituais. Para elevar a vibração e a expansão, sentindo o poder da conexão com o agora."
          index="03"
        />
      </div>

      {/* footer */}
      <div
        id="footer"
        className="relative z-20 my-20 flex flex-col justify-center items-center space-y-10 max-w-2xl"
      >
        <p className="uppercase tracking-wider font-bergenregular text-center text-brain-green lg:text-2xl px-4 text-xl">
          Nossa linha de produtos te guia para uma vida com mais conexão em suas
          diferentes esferas.
        </p>
        <Link href="/produtos">
          <Button>enjoy the journey</Button>
        </Link>
      </div>
    </motion.div>
  )
}

interface CustomSectionProps {
  title: string
  subtitle: string
  imageUrl: string
  imageAlt: string
  imageWidth: number
  imageHeight: number
  description: string
  index: string
}

const CustomSection: React.FC<CustomSectionProps> = ({
  title,
  subtitle,
  imageUrl,
  imageAlt,
  imageWidth,
  imageHeight,
  description,
  index,
}) => {
  return (
    <div className="lg:grid lg:grid-cols-3 flex flex-col lg:h-[30vh] h-[38vh] items-center gap-4">
      {/* left column */}
      <div className="lg:text-right text-center">
        <p className="font-windsor lg:text-7xl text-5xl text-brain-green">
          {title}
        </p>
        <p className="font-bergensemi uppercase text-lg">{subtitle}</p>
      </div>

      {/* center */}
      <div className="flex flex-col lg:items-center gap-4">
        <p className="font-bergensemi tracking-wider">({index})</p>
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          className="z-10"
          priority
        />
      </div>

      {/* right column */}
      <div className="lg:text-left text-center">
        <p className="max-w-[390px] font-windsor lg:text-lg">{description}</p>
      </div>
    </div>
  )
}
