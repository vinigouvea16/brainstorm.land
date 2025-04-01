'use client'

import { useEffect } from 'react'
import { useCart } from '@/contexts/cart-context'

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

    console.log('GA4: Carrinho atualizado', cartItems.length)
  }, [cartItems])

  return null
}
