'use client'

import CartIcon from '@/components/store-components/cart-icon'
import Image from 'next/image'

export default function HeaderStore() {
  return (
    <header
      className="bg-brain-green/15 border-b border-brain-span/10 py-4"
      id="hero"
    >
      <div className="container mx-auto px-4 2xl:px-0 flex items-center 2xl:max-w-[1440px] max-w-[1280px] justify-between ">
        <a href="/" className="text-2xl font-semibold hover:text-brain-span">
          <Image
            src="/trademark.png"
            alt=""
            width={180}
            height={30}
            className="h-auto hover:brightness-125"
          />
        </a>
        <nav>
          <ul className="flex items-center gap-4">
            <li>
              <a
                href="/produtos"
                className="hover:text-brain-span font-bergenregular tracking-wider uppercase"
              >
                Produtos
              </a>
            </li>
            <li>
              <CartIcon />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
