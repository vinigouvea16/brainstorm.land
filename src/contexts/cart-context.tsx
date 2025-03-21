'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

type CartItem = {
  id: string
  variantId: string
  title: string
  price: string
  image: string
  quantity: number
}

type CartContextType = {
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  cartItems: CartItem[]
  addToCart: (
    item: Omit<CartItem, 'quantity'>,
    quantity: number
  ) => Promise<void>
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cartItems.reduce(
    (total, item) => total + Number.parseFloat(item.price) * item.quantity,
    0
  )

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart))
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)
  const toggleCart = () => setIsOpen(prev => !prev)

  const addToCart = async (
    item: Omit<CartItem, 'quantity'>,
    quantity: number
  ) => {
    setIsLoading(true)
    try {
      let cartId = localStorage.getItem('shopifyCartId')

      if (!cartId) {
        // console.log('Criando novo carrinho Shopify...')
        const cartResponse = await fetch('/api/shopify/cart/create', {
          method: 'POST',
        })

        if (!cartResponse.ok) throw new Error('Falha ao criar carrinho')

        const cartData = await cartResponse.json()
        cartId = cartData.cartId

        if (typeof cartId === 'string') {
          localStorage.setItem('shopifyCartId', cartId)
          // console.log('Novo carrinho Shopify criado:', cartId)
        } else {
          throw new Error('ID do carrinho inválido recebido da API')
        }
      } else {
        // console.log('Usando carrinho Shopify existente:', cartId)
      }

      if (!cartId) {
        throw new Error('ID do carrinho não disponível')
      }

      // console.log(
      //   'Adicionando ao carrinho Shopify:',
      //   item,
      //   'quantidade:',
      //   quantity
      // )
      const response = await fetch('/api/shopify/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartId,
          variantId: item.variantId,
          quantity,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Erro na resposta da API:', errorData)

        if (errorData.error === 'product_out_of_stock') {
          throw new Error(errorData.message || 'Produto esgotado')
        }

        throw new Error(
          `Falha ao adicionar item ao carrinho: ${response.status} ${response.statusText}`
        )
      }

      setCartItems(prev => {
        const existingItemIndex = prev.findIndex(i => i.id === item.id)

        if (existingItemIndex >= 0) {
          const updatedItems = [...prev]
          updatedItems[existingItemIndex].quantity += quantity
          return updatedItems
        }
        return [...prev, { ...item, quantity }]
      })

      openCart()
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert(
        `Erro ao adicionar ao carrinho: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      )
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (id: string) => {
    setIsLoading(true)
    try {
      setCartItems(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.error('Error removing from cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return

    setIsLoading(true)
    try {
      // TODO: Implement Shopify cart line update API call

      setCartItems(prev =>
        prev.map(item => (item.id === id ? { ...item, quantity } : item))
      )
    } catch (error) {
      console.error('Error updating cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Clear cart
  const clearCart = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement Shopify cart clear API call

      // Clear local cart state
      setCartItems([])
      localStorage.removeItem('shopifyCartId')
    } catch (error) {
      console.error('Error clearing cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CartContext.Provider
      value={{
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
