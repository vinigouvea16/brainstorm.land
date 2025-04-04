'use client'

import { useState, useEffect } from 'react'
import { useRegion } from '@/contexts/region-context'

export function useRegionProducts(productHandles: string[]) {
  const { region, isLoading: isRegionLoading } = useRegion()
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isRegionLoading) return

    async function fetchProducts() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/shopify/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            handles: productHandles,
            region,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data = await response.json()
        setProducts(data.products)
      } catch (err) {
        console.error('Error fetching region products:', err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    if (productHandles.length > 0) {
      fetchProducts()
    } else {
      setProducts([])
      setIsLoading(false)
    }
  }, [productHandles, region, isRegionLoading])

  return { products, isLoading, error }
}
