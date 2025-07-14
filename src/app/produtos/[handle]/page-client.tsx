'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import AddToCartButton from '@/components/store-components/add-to-cart-button'
import QuantitySelector from '@/components/store-components/quantity-selector'
import ProductSuggestions from '@/components/store-components/suggestions'
import VariantSelector from '@/components/store-components/variant-selector'
import ShareButton from '@/components/share-button'
// import { useCart } from '@/contexts/cart-context'
import { motion } from 'motion/react'
import { trackViewProduct } from '@/lib/analytics'
import type { ProductClientProps } from '@/types/product'
import { DiscountTable } from '@/components/discount-table'
import SmartProductDescription from '@/components/store-components/smart-product-description'

export default function ProductClient({
  product,
  relatedProducts,
}: ProductClientProps) {
  if (!product) {
    return <div className="p-8 text-center">Produto não encontrado</div>
  }

  const [quantity, setQuantity] = useState(1)
  const [selectedVariantId, setSelectedVariantId] = useState(
    () => product.variantId || ''
  )
  const [isLoading, setIsLoading] = useState(false)
  const [currentImage, setCurrentImage] = useState(
    product.images && product.images.length > 0
      ? product.images[0]
      : '/placeholder.svg'
  )

  // const { addToCart, checkout, syncCart, checkoutUrl } = useCart()

  const selectedVariant = product.variants?.find(
    v => v.id === selectedVariantId
  )

  const variantPrice = selectedVariant?.price || product.price || '0'

  const numericPrice = Number.parseFloat(variantPrice)
  // biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
  const formattedPrice = !isNaN(numericPrice)
    ? `${product.currency || ''} ${numericPrice.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : ''

  const isAvailable = selectedVariant?.availableForSale ?? false

  const handleVariantChange = (variantId: string) => {
    // const selectedVariant = product.variants?.find(v => v.id === variantId)
    setSelectedVariantId(variantId)
    setQuantity(1)
  }

  const handleImageClick = (img: string) => {
    setCurrentImage(img)
  }

  useEffect(() => {
    if (product) {
      trackViewProduct({
        item_id: product.id,
        item_name: product.title,
        item_variant: selectedVariantId,
        price: Number.parseFloat(variantPrice),
        currency: product.currency || 'BRL',
      })
    }
  }, [product, selectedVariantId, variantPrice])

  const isParaNutrir = product.tags?.includes('para nutrir')

  return (
    <main className="2xl:max-w-[1440px] max-w-[1280px] mx-auto px-2 2xl:px-0 mt-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {product.images && product.images.length > 0 ? (
            <div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeIn' }}
              >
                <Image
                  src={currentImage}
                  alt={product.title || ''}
                  width={715}
                  height={600}
                  className="rounded-lg w-full lg:max-h-[600px] max-w-[650px] max-h-[400px] lg:min-h-[450px] min-h-[200px] object-cover opacity-80 hover:opacity-100 mx-auto"
                  priority
                />
              </motion.div>

              {/* grid */}
              {product.images.length > 1 && (
                <div className="grid md:grid-cols-3 grid-cols-3 md:gap-4 gap-2 mt-4">
                  {product.images.map((img, index) => (
                    <button
                      type="button"
                      key={`product-image-${
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        index
                      }`}
                      onClick={() => handleImageClick(img)}
                      className="focus:outline-none w-fit h-fit mx-auto"
                    >
                      <Image
                        src={img || '/placeholder.svg'}
                        alt={`${product.title || 'Produto'} - ${index + 1}`}
                        width={200}
                        height={200}
                        className={`max-h-[100px] md:max-h-[120px] lg:max-h-[150px]  xl:max-h-[180px] max-w-[100px] md:max-w-[120px] lg:max-w-[150px]  xl:max-w-[180px] rounded object-cover opacity-80 hover:opacity-100 transition ${
                          img === currentImage
                            ? 'ring-2 ring-brain-span/75'
                            : ''
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg flex items-center justify-center h-[600px]">
              <p className="text-gray-500">Imagem não disponível</p>
            </div>
          )}
        </div>

        {/* detalhes do produto */}
        <div className="w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
            }}
            className="flex flex-col lg:space-y-8 space-y-4"
          >
            {/*span*/}
            <motion.div
              variants={{
                hidden: { opacity: 0, translateY: '50%' },
                visible: {
                  opacity: 1,
                  translateY: 0,
                  transition: { duration: 0.3, ease: 'easeIn' },
                },
              }}
              className="font-bergenregular uppercase text-sm tracking-tighter text-brain-span"
            >
              <span>brain co.</span>
            </motion.div>

            {/* informacoes produto */}
            <div className="space-y-4 font-windsor">
              <motion.h1
                variants={{
                  hidden: { opacity: 0, translateY: '50%' },
                  visible: {
                    opacity: 1,
                    translateY: 0,
                    transition: { duration: 0.3, ease: 'easeIn' },
                  },
                }}
                className="lg:text-5xl text-4xl"
              >
                {product.title || 'Titulo indisponivel'}
              </motion.h1>

              {formattedPrice && (
                <motion.p
                  variants={{
                    hidden: { opacity: 0, translateY: '20%' },
                    visible: {
                      opacity: 1,
                      translateY: 0,
                      transition: { duration: 0.3, ease: 'easeIn' },
                    },
                  }}
                  className="text-3xl"
                >
                  {formattedPrice}
                </motion.p>
              )}
              {isParaNutrir && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, translateY: '10%' },
                    visible: {
                      opacity: 1,
                      translateY: 0,
                      transition: { duration: 0.3, ease: 'easeIn' },
                    },
                  }}
                >
                  <DiscountTable quantity={quantity} />
                  <p className="text-center my-2 underline underline-offset-4 ">
                    Obs: Desconto aplicado automaticamente no checkout
                  </p>
                </motion.div>
              )}

              {/* linear gradient line */}
              <motion.div
                variants={{
                  hidden: { scaleX: 0 },
                  visible: {
                    scaleX: 1,
                    transition: { duration: 0.3, ease: 'easeOut' },
                  },
                }}
                className="h-[1px] w-11/12 mx-auto bg-gradient-to-r from-brain-hover/5 via-brain-span to-brain-hover/5 origin-center"
                style={{ transformOrigin: 'center' }}
              />
            </div>
          </motion.div>

          {/* secao de compra */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
            }}
            className="mt-6"
          >
            {product.variants && product.variants.length > 0 && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, translateY: '20%' },
                  visible: {
                    opacity: 1,
                    translateY: 0,
                    transition: { duration: 0.3, ease: 'easeIn' },
                  },
                }}
              >
                <VariantSelector
                  variants={product.variants}
                  onVariantChange={handleVariantChange}
                  defaultVariantId={product.variantId}
                />
              </motion.div>
            )}

            <motion.div
              variants={{
                hidden: { opacity: 0, translateY: '50%' },
                visible: {
                  opacity: 1,
                  translateY: 0,
                  transition: { duration: 0.3, ease: 'easeIn' },
                },
              }}
            >
              <QuantitySelector
                initialQuantity={1}
                onChange={setQuantity}
                disabled={!isAvailable}
              />
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { duration: 0.3, ease: 'easeIn' },
                },
              }}
              className="mt-4 space-y-3 flex flex-col"
            >
              <AddToCartButton
                productId={product.id}
                variantId={selectedVariantId}
                title={product.title || 'Produto'}
                price={variantPrice}
                image={
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : ''
                }
                quantity={quantity}
                availableForSale={isAvailable}
              />
            </motion.div>
          </motion.div>

          {/* descricao  */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.4 } },
            }}
          >
            <SmartProductDescription
              product={product}
              isParaNutrir={isParaNutrir}
            />

            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { duration: 0.3, ease: 'easeIn', delay: 1.6 },
                },
              }}
            >
              <ShareButton />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Produtos Relacionados</h2>
          <ProductSuggestions
            products={relatedProducts}
            currentProductId={product.id}
          />
        </div>
      )}
      <div className="lg:h-28 h-14" />
      <div className="h-[1px] w-11/12 mx-auto bg-gradient-to-r from-brain-hover/0 via-brain-green to-brain-hover/0" />
    </main>
  )
}
