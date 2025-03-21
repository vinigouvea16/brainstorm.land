'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    cartItems,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartTotal,
    isLoading,
  } = useCart()

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [closeCart])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end text-xl text-black">
      {/* backdrop */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* cart drawer */}
      <div className="relative w-full max-w-md bg-brain-text shadow-xl flex flex-col h-full transform transition-transform ">
        {/* header */}
        <div className="flex items-center justify-between p-4  border-b">
          <h2 className="text-xl font-normal flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Carrinho ({cartCount})
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Fechar carrinho"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* cart content */}
        <div className="flex-1 overflow-y-auto p-4 font-windsor">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-16 w-16 text-gray-500 mb-4" />
              <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
              <button
                type="button"
                onClick={closeCart}
                className="px-4 py-2 bg-brain-span text-black rounded-md hover:brightness-110"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <ul className="divide-y">
              {cartItems.map(item => (
                <li key={item.id} className="py-4 flex items-center">
                  {/* product image */}
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                    <Image
                      src={item.image || '/placeholder.svg'}
                      alt={item.title}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  {/* product details */}
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between font-medium">
                        <h3>
                          <Link
                            href={`/produtos/${item.id}`}
                            className="hover:underline"
                          >
                            {item.title}
                          </Link>
                        </h3>
                        <p className="ml-4">
                          {formatPrice(
                            Number.parseFloat(item.price) * item.quantity
                          )}
                        </p>
                      </div>
                      <p className="mt-1 text-gray-500">
                        {formatPrice(Number.parseFloat(item.price))} cada
                      </p>
                    </div>

                    {/* quantity controls */}
                    <div className="flex items-center justify-between text-base mt-2">
                      <div className="flex items-center  border rounded-md">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1 || isLoading}
                          className="p-1 hover:bg-gray-100 disabled:opacity-50"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-2">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={isLoading}
                          className="p-1 hover:bg-gray-100 disabled:opacity-50"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        disabled={isLoading}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                        aria-label="Remover item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* drawer footer */}
        {cartItems.length > 0 && (
          <div className=" border-t p-4">
            <div className="flex justify-between text-xl font-medium mb-4">
              <p>Subtotal</p>
              <p>{formatPrice(cartTotal)}</p>
            </div>
            <p className="text-base text-gray-500 mb-4">
              Frete e impostos calculados no checkout
            </p>
            <button
              type="button"
              className="w-full bg-brain-span text-black py-3 rounded-2xl text-xl font-bergenregular uppercase hover:brightness-125 hover:text-brain-green"
            >
              Finalizar Compra
            </button>
            <div className="mt-2 flex justify-center text-base text-gray-500">
              <button
                type="button"
                className="hover:text-gray-700 "
                onClick={closeCart}
              >
                ou Continuar Comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
