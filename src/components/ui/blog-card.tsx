'use client'
import Image from 'next/image'
import SecondArrowIcon from '../icons/secondarrow'
import AnimatedLink from '../animations/magnetic-button/framer'
import { motion } from 'framer-motion'
import Link from 'next/link'

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
    <Link href={href}>
      <motion.div
        className={`
        relative p-10 flex flex-col overflow-hidden ${className}
        w-full sm:w-full max-h-[564px] min-h-[414px] lg:h-[564px] sm:h-full max-w-[465px]
      `}
        initial="initial"
        whileInView="animate"
        viewport={{ amount: 0.3, once: true }}
        whileHover="hover"
        variants={cardVariants}
      >
        <motion.div
          className="absolute inset-0"
          variants={imageWrapperVariants}
        >
          <Image
            src={backgroundImage}
            alt="Card background"
            fill
            className="object-cover z-0 rounded-3xl brightness-50"
            style={{ opacity }}
          />
        </motion.div>

        <div className="font-windsor text-brain-text relative z-10 flex flex-col items-center mt-[80%] lg:mt-[50%] gap-20 lg:text-2xl xl:text-3xl">
          <AnimatedLink>
            <SecondArrowIcon />
          </AnimatedLink>
          <motion.div variants={textVariants}>{children}</motion.div>
        </div>
      </motion.div>
    </Link>
  )
}
