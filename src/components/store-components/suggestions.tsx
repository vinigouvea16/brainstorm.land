import Image from 'next/image'
import Link from 'next/link'
import type { ProductSuggestionsProps } from '@/types/product'
// import { useRegion } from '@/contexts/region-context'

// const ProductSuggestions: React.FC<ProductSuggestionsProps> = ({
//   products,
//   currentProductId,
// }) => {
//   const { currencySymbol } = useRegion()
//   if (!products || products.length === 0) {
//     return null
//   }

//   const formatPrice = (
//     price: string | undefined,
//     currency: string | undefined
//   ) => {
//     if (!price) return `${currencySymbol}0,00`

//     const numericPrice = Number.parseFloat(price)
//     return numericPrice.toLocaleString('pt-BR', {
//       style: 'currency',
//       currency: currency || 'BRL',
//       minimumFractionDigits: 2,
//     })
//   }

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//       {products.map(product => (
//         <Link
//           key={product.id}
//           href={`/produtos/${product.handle}`}
//           className="block group"
//         >
//           <div className="relative w-full aspect-square overflow-hidden rounded-lg">
//             {product.images.length > 0 ? (
//               <div className="relative w-full h-full">
//                 <Image
//                   src={product.images[0] || '/placeholder.svg'}
//                   alt={product.title}
//                   fill
//                   sizes="(max-width: 768px) 50vw, 25vw"
//                   className="object-cover absolute transition-opacity duration-300 opacity-100 group-hover:opacity-0"
//                 />
//                 {product.images.length > 1 && (
//                   <Image
//                     src={product.images[1] || '/placeholder.svg'}
//                     alt={`${product.title} - alternativa`}
//                     fill
//                     sizes="(max-width: 768px) 50vw, 25vw"
//                     className="object-cover absolute transition-opacity duration-300 opacity-0 group-hover:opacity-100"
//                   />
//                 )}
//               </div>
//             ) : (
//               <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                 <span className="text-gray-400">Sem imagem</span>
//               </div>
//             )}
//           </div>
//           <h3 className="text-center mt-2 lg:text-lg font-medium font-albra">
//             {product.title}
//           </h3>
//           <p className="text-center lg:text-lg text-brain-span/80 font-albra">
//             {new Intl.NumberFormat('pt-BR', {
//               style: 'currency',
//               currency: product.currency || 'BRL',
//             }).format(Number.parseFloat(product.price))}
//           </p>
//         </Link>
//       ))}
//     </div>
//   )
// }

// export default ProductSuggestions

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
              <div className="relative w-full h-full">
                <Image
                  src={product.images[0] || '/placeholder.svg'}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover absolute transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                />
                {product.images.length > 1 && (
                  <Image
                    src={product.images[1] || '/placeholder.svg'}
                    alt={`${product.title} - alternativa`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover absolute transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                  />
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Sem imagem</span>
              </div>
            )}
          </div>
          <h3 className="text-center mt-2 lg:text-lg font-medium font-albra">
            {product.title}
          </h3>
          <p className="text-center lg:text-lg text-brain-span/80 font-albra">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: product.currency || 'BRL',
            }).format(Number.parseFloat(product.price))}
          </p>
        </Link>
      ))}
    </div>
  )
}

export default ProductSuggestions
