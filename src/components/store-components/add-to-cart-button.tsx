'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/cart-context'

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
      // console.log('Produto adicionado com sucesso ao carrinho')
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
      className="w-full border border-brain-border text-brain-text py-3 rounded-2xl text-base font-bergenregular uppercase hover:border-white hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleAddToCart}
      disabled={isAdding || !availableForSale}
    >
      {isAdding
        ? 'Adicionando...'
        : availableForSale
          ? 'Adicionar ao Carrinho'
          : 'Esgotado'}
    </button>
  )
}
