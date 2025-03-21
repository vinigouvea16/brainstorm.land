'use client'

import { useCart } from '@/contexts/cart-context'
import { ShoppingCart } from 'lucide-react'

export default function CartIcon() {
  const { toggleCart, cartCount } = useCart()

  return (
    <button
      type="button"
      onClick={toggleCart}
      className="relative p-2 rounded-full hover:bg-brain-border"
      aria-label="Abrir carrinho"
    >
      <ShoppingCart className="h-6 w-6" />
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-brain-span text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </button>
  )
}
