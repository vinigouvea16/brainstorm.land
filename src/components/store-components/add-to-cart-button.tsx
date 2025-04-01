'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/cart-context'
import { trackAddToCart } from '@/lib/analytics'

type AddToCartButtonProps = {
  productId: string
  variantId: string
  title: string
  price: string
  image: string
  quantity: number
  availableForSale?: boolean
  quantityAvailable?: number
}

export default function AddToCartButton({
  productId,
  variantId,
  title,
  price,
  image,
  quantity,
  availableForSale = true,
  quantityAvailable,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    setIsAdding(true)

    try {
      if (!availableForSale) {
        alert('Este produto está esgotado.')
        return
      }

      await addToCart(
        {
          id: productId,
          variantId: variantId,
          title: title,
          price: price,
          image: image,
        },
        quantity
      )

      trackAddToCart({
        item_id: productId,
        item_variant: variantId,
        item_name: title,
        price: Number.parseFloat(price),
        quantity: quantity,
        currency: 'BRL',
      })

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      console.error('Erro detalhado ao adicionar produto:', error)
      alert(
        `Erro ao adicionar ao carrinho: ${error.message || 'Erro desconhecido'}`
      )
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <button
      type="button"
      className={`w-full py-3 rounded-2xl text-lg font-bergenregular uppercase ${
        availableForSale
          ? 'bg-brain-span text-black hover:brightness-125 hover:text-brain-green'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
      disabled={isAdding || !availableForSale}
      onClick={handleAddToCart}
    >
      {isAdding
        ? 'Adicionando...'
        : availableForSale
          ? 'Adicionar ao Carrinho'
          : 'Esgotado'}
    </button>
  )
}
