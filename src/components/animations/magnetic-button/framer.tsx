'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { useRef, useState } from 'react'

export default function AnimatedLink({
  children,
  href,
}: { children: React.ReactNode; href: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { height, width, left, top } = ref.current.getBoundingClientRect()
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)
    setPosition({ x: middleX, y: middleY })
  }

  const reset = () => setPosition({ x: 0, y: 0 })

  return (
    <Link href={href} className="w-full flex justify-center">
      <motion.div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', stiffness: 240, damping: 15, mass: 0.1 }}
        className="relative md:py-4 2xl:py-5 py-4 rounded-full bg-background flex justify-center w-[17%]"
      >
        {children}
      </motion.div>
    </Link>
  )
}
