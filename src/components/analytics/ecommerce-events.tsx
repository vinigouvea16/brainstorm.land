'use client'

import { useEffect } from 'react'
import { useCart } from '@/contexts/cart-context'

declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void
  }
}

export default function EcommerceEvents() {
  const { cartItems } = useCart()

  useEffect(() => {
    if (!window.gtag || cartItems.length === 0) return

    window.gtag('event', 'view_cart', {
      currency: 'BRL',
      value: cartItems.reduce(
        (total, item) => total + Number.parseFloat(item.price) * item.quantity,
        0
      ),
      items: cartItems.map(item => ({
        item_id: item.id,
        item_name: item.title,
        price: Number.parseFloat(item.price),
        quantity: item.quantity,
      })),
    })
  }, [cartItems])

  return null
}
