'use client'

import { useRegionProducts } from '@/hooks/use-region-products'
import Link from 'next/link'
import Image from 'next/image'
import PriceDisplay from './price-display'

type FeaturedProductsProps = {
  productIds: string[]
}

export default function FeaturedProducts({
  productIds,
}: FeaturedProductsProps) {
  const { products, isLoading, error } = useRegionProducts(productIds)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-800 h-64 rounded-lg mb-4" />
            <div className="h-6 bg-gray-800 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  if (products.length === 0) {
    return (
      <div className="text-center">Nenhum produto em destaque disponível.</div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {products.map(product => (
        <Link
          href={`/produtos/${product.handle}`}
          key={product.id}
          className="group"
        >
          <div className="bg-[#0a0b12] rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:shadow-brain-span/20">
            <div className="relative h-64 overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image || '/placeholder.svg'}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-500">Sem imagem</span>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-brain-span transition-colors">
                {product.title}
              </h3>

              <PriceDisplay amount={product.price} />

              {!product.availableForSale && (
                <span className="inline-block mt-2 text-sm text-red-500">
                  Esgotado
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
