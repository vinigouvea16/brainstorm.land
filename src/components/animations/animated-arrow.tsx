import { motion } from 'motion/react'

const leftArrowVariants = {
  initial: { x: '-150%' },
  animate: { x: '0%', transition: { duration: 0.2, ease: 'easeOut' } },
}

const rightArrowVariants = {
  initial: { x: '150%' },
  animate: { x: '0%', transition: { duration: 0.2, ease: 'easeOut' } },
}

export default function DownloadArrow() {
  return (
    <div
      aria-label="Download PDF"
      className="w-10 h-10 rounded-full grid place-items-center overflow-hidden shadow"
    >
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
      <motion.svg
        variants={leftArrowVariants}
        initial="initial"
        animate="animate"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute"
      >
        <path
          d="M18.25 14L12 20.25L5.75 14M12 19.5V3.75"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
      <motion.svg
        variants={rightArrowVariants}
        initial="initial"
        animate="animate"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute"
      >
        <path
          d="M18.25 14L12 20.25L5.75 14M12 19.5V3.75"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </div>
  )
}
