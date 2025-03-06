'use client'
import Image from 'next/image'
import SecondArrowIcon from '../icons/secondarrow'
import AnimatedLink from '../animations/magnetic-button/framer'
import { motion } from 'framer-motion'

interface CardProps {
  backgroundImage: string
  opacity?: number
  children: React.ReactNode
  className?: string
  href?: string | undefined
}

const cardVariants = {
  initial: { scale: 0.1, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
}

const imageWrapperVariants = {
  initial: { filter: 'blur(8px)' },
  animate: {
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: 'easeOut' },
  },
}

const textVariants = {
  initial: { opacity: 0, y: 0 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
  hover: {
    opacity: 0,
    y: '50%',
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
}

export default function BlogCard({
  backgroundImage,
  opacity = 1,
  children,
  className = '',
  href = '/portal-brain',
}: CardProps) {
  return (
    <motion.div
      className={`
        relative p-10 flex flex-col overflow-hidden ${className}
        w-full sm:w-full max-h-[564px] lg:h-[564px] sm:h-full max-w-[465px]
      `}
      initial="initial"
      whileInView="animate"
      viewport={{ amount: 0.3, once: true }}
      whileHover="hover"
      variants={cardVariants}
    >
      <motion.div className="absolute inset-0" variants={imageWrapperVariants}>
        <Image
          src={backgroundImage}
          alt="Card background"
          fill
          className="object-cover z-0 rounded-3xl brightness-50"
          style={{ opacity }}
        />
      </motion.div>

      <div className="font-windsor text-3xl text-brain-text relative z-10 flex flex-col items-center mt-[50%] justify-between h-full md:gap-20 gap-20">
        <AnimatedLink href={href}>
          <SecondArrowIcon />
        </AnimatedLink>
        <motion.div
          variants={textVariants}
          className="w-full text-left text-xl md:text-3xl lg:text-3xl"
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  )
}
