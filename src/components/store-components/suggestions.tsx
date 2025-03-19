import type React from 'react'
import Image from 'next/image'
import Link from 'next/link'

type Product = {
  id: string
  title: string
  handle: string
  images: string[]
}

type ProductSuggestionsProps = {
  products: Product[]
  currentProductId: string
}

const ProductSuggestions: React.FC<ProductSuggestionsProps> = ({
  products,
  currentProductId,
}) => {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map(product => (
        <Link
          key={product.id}
          href={`/produtos/${product.handle}`}
          className="block group"
        >
          <div className="relative w-full aspect-square overflow-hidden rounded-lg">
            {product.images.length > 0 ? (
              <>
                <Image
                  src={product.images[0] || '/placeholder.svg'}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                />
                {product.images.length > 1 && (
                  <Image
                    src={product.images[1] || '/placeholder.svg'}
                    alt={`${product.title} - alternativa`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Sem imagem</span>
              </div>
            )}
          </div>
          <h3 className="text-center mt-2 text-sm font-medium">
            {product.title}
          </h3>
        </Link>
      ))}
    </div>
  )
}

export default ProductSuggestions
