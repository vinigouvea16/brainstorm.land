'use client'

import React, { useState, useEffect } from 'react'
import Button from '../ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
// import RegionSelector from '../region/region-selector'

export default function Header() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', controlHeader)

    return () => {
      window.removeEventListener('scroll', controlHeader)
    }
  }, [lastScrollY])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev)
  }

  return (
    <header
      className={` lg:p-14 md:p-8 text-white/80 tracking-wider fixed top-0 left-0 w-full z-20 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* desktop */}
      <motion.div
        initial={{ translateY: '-100%', opacity: 0.1 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeIn' }}
        className="hidden md:flex justify-between items-start"
      >
        <div id="nav-inner" className="flex">
          <div className="grid grid-cols-3">
            <a href="/">
              <Image
                src="/logobrain.png"
                alt=""
                width={29}
                height={42}
                className="h-auto hover:brightness-110"
              />
            </a>
          </div>
          <div id="nav-menu" className="ml-5">
            <div id="nav-link-wrapper" className="flex flex-col">
              <ul className="flex flex-col items-start gap-3 font-bergenregular uppercase text-sm">
                <li
                  className={`hover:text-brain-text ${pathname === '/' ? 'text-brain-span' : ''}`}
                >
                  <Link href="/">Home</Link>
                </li>
                <li
                  className={`hover:text-brain-text ${pathname === '/produtos' ? 'text-brain-span' : ''}`}
                >
                  <Link href="/produtos">Produtos</Link>
                </li>
                <li
                  className={`hover:text-brain-text ${pathname === '/portal-brain' ? 'text-brain-span' : ''}`}
                >
                  <Link href="/portal-brain">Blog</Link>
                </li>
                <li
                  className={`hover:text-brain-text ${pathname === '/contato' ? 'text-brain-span' : ''}`}
                >
                  <a href="https://wa.me/5541992478837">Contato</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Link
          href="/produtos"
          className={pathname === '/produtos' ? 'hidden' : 'block'}
        >
          <Button variant="default">ver produtos</Button>
        </Link>
      </motion.div>

      {/* mobile */}
      <motion.div
        initial={{ translateY: '-100%', opacity: 0.1 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeIn' }}
        className="flex md:hidden justify-between p-6 items-center bg-black/35 mix-blend-hue backdrop-blur-sm"
      >
        <a href="/">
          <Image
            src="/logobrain.png"
            alt="Logo"
            width={29}
            height={42}
            className="h-auto hover:brightness-110"
          />
        </a>
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button onClick={toggleMobileMenu} className="focus:outline-none">
          {/* hamburger icon */}
          {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </motion.div>

      {/* menu dropdown */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full pl-4 left-0 w-full bg-[#05060b] py-4 flex flex-col space-y-4"
        >
          <ul className="flex flex-col gap-4 font-bergenregular uppercase text-sm">
            <li
              className={`hover:opacity-70 ${pathname === '/' ? 'text-brain-span' : ''}`}
            >
              <Link href="/">Home</Link>
            </li>
            <li
              className={`hover:opacity-70 ${pathname === '/produtos' ? 'text-brain-span' : ''}`}
            >
              <Link href="/produtos">Produtos</Link>
            </li>
            <li
              className={`hover:opacity-70 ${pathname === '/portal-brain' ? 'text-brain-span' : ''}`}
            >
              <Link href="/portal-brain">Blog</Link>
            </li>
            <li
              className={`hover:opacity-70 ${pathname === '/contato' ? 'text-brain-span' : ''}`}
            >
              <a href="https://wa.me/5541992478837">Contato</a>
            </li>
          </ul>
        </motion.div>
      )}
    </header>
  )
}
