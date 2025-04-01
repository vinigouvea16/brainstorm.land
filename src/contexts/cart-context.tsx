'use client'

import { trackBeginCheckout } from '@/lib/analytics'
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
  lineId?: string
}

type CartContextType = {
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  cartItems: CartItem[]
  addToCart: (
    item: Omit<CartItem, 'quantity'>,
    quantity: number,
    openDrawer?: boolean
  ) => Promise<void>
  removeFromCart: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  cartCount: number
  cartTotal: number
  isLoading: boolean
  checkout: () => Promise<void>
  checkoutUrl: string | null
  syncCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [lastSyncTime, setLastSyncTime] = useState<number>(0)
  const [isSyncing, setIsSyncing] = useState(false)

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cartItems.reduce(
    (total, item) => total + Number.parseFloat(item.price) * item.quantity,
    0
  )

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    const storeCheckoutUrl = localStorage.getItem('shopifyCheckoutUrl')

    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart))
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error)
      }
    }

    if (storeCheckoutUrl) {
      setCheckoutUrl(storeCheckoutUrl)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    if (checkoutUrl) {
      localStorage.setItem('shopifyCheckoutUrl', checkoutUrl)
    }
  }, [checkoutUrl])

  const openCart = async () => {
    if (cartItems.length > 0 && Date.now() - lastSyncTime > 60000) {
      await syncCart()
    }
    setIsOpen(true)
  }
  const closeCart = () => setIsOpen(false)
  const toggleCart = async () => {
    if (!isOpen && cartItems.length > 0 && Date.now() - lastSyncTime > 60000) {
      await syncCart()
    }
    setIsOpen(prev => !prev)
  }

  const syncCart = async () => {
    if (isSyncing || cartItems.length === 0) return

    setIsSyncing(true)
    try {
      const cartId = localStorage.getItem('shopifyCartId')

      if (!cartId) {
        const createCartResponse = await fetch('/api/shopify/cart/create', {
          method: 'POST',
        })
        const newCartData = await createCartResponse.json()

        if (newCartData.cartId) {
          localStorage.setItem('shopifyCartId', newCartData.cartId)
          setCheckoutUrl(newCartData.checkoutUrl)
        }
      }

      const itemsToSync = cartItems.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }))

      const response = await fetch('/api/shopify/cart/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartId: cartId || '',
          items: itemsToSync,
          forceCheckoutUrl: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error syncing cart:', errorData)
        throw new Error('Failed to sync cart with Shopify')
      }

      const data = await response.json()

      if (data.isNewCart || !cartId) {
        localStorage.setItem('shopifyCartId', data.cartId)
      }

      if (data.checkoutUrl) {
        setCheckoutUrl(data.checkoutUrl)
      } else {
        const checkoutUrlResponse = await fetch(
          '/api/shopify/cart/create-checkout',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              cartId: data.cartId,
            }),
          }
        )

        const checkoutData = await checkoutUrlResponse.json()
        if (checkoutData.checkoutUrl) {
          setCheckoutUrl(checkoutData.checkoutUrl)
        } else {
          throw new Error('Não foi possível criar URL de checkout')
        }
      }

      if (data.lines && data.lines.length > 0) {
        setCartItems(prev => {
          return prev.map(item => {
            const line = data.lines.find(
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              (l: any) => l.variantId === item.variantId
            )
            if (line) {
              return { ...item, lineId: line.id }
            }
            return item
          })
        })
      }

      setLastSyncTime(Date.now())
    } catch (error) {
      console.error('Error syncing cart:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  const addToCart = async (
    item: Omit<CartItem, 'quantity'>,
    quantity: number,
    openDrawer = true
  ) => {
    setIsLoading(true)
    try {
      let cartId = localStorage.getItem('shopifyCartId')

      if (!cartId) {
        const createCartResponse = await fetch('/api/shopify/cart/create', {
          method: 'POST',
        })
        const newCartData = await createCartResponse.json()

        if (newCartData.cartId) {
          cartId = newCartData.cartId
          localStorage.setItem('shopifyCartId', newCartData.cartId)
          setCheckoutUrl(newCartData.checkoutUrl)
        } else {
          throw new Error('Failed to create cart')
        }
      }

      setCartItems(prev => {
        const existingItem = prev.find(i => i.id === item.id)
        return existingItem
          ? prev.map(i =>
              i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
            )
          : [...prev, { ...item, quantity }]
      })

      if (openDrawer) setIsOpen(true)
      syncCart()
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromCart = async (id: string) => {
    setIsLoading(true)
    try {
      setCartItems(prev => prev.filter(item => item.id !== id))

      syncCart().catch(error => {
        console.error('Background sync failed after remove:', error)
      })
    } catch (error) {
      console.error('Error removing from cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(id)
    setIsLoading(true)
    try {
      setCartItems(prev =>
        prev.map(item => (item.id === id ? { ...item, quantity } : item))
      )
      syncCart()
    } finally {
      setIsLoading(false)
    }
  }

  const clearCart = async () => {
    setIsLoading(true)
    try {
      setCartItems([])
      localStorage.removeItem('shopifyCartId')
      localStorage.removeItem('shopifyCheckoutUrl')
      setCheckoutUrl(null)
    } finally {
      setIsLoading(false)
    }
  }

  const checkout = async () => {
    try {
      setIsLoading(true)
      if (!checkoutUrl) {
        throw new Error('Checkout URL not available')
      }

      trackBeginCheckout(
        cartItems.map(item => ({
          item_id: item.id,
          item_variant: item.variantId,
          item_name: item.title,
          price: Number.parseFloat(item.price),
          quantity: item.quantity,
          currency: 'BRL',
        }))
      )

      window.location.href = checkoutUrl
    } catch (error) {
      console.error('Error during checkout:', error)
      alert(
        `Checkout error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      )
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
        checkout,
        checkoutUrl,
        syncCart,
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
