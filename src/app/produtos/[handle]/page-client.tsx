'use client'

import { useState } from 'react'
import Image from 'next/image'
import AddToCartButton from '@/components/store-components/add-to-cart-button'
import QuantitySelector from '@/components/store-components/quantity-selector'
import ProductSuggestions from '@/components/store-components/suggestions'
import VariantSelector from '@/components/store-components/variant-selector'
import ShareButton from '@/components/share-button'
import { useCart } from '@/contexts/cart-context'

type Product = {
  product: Product
  id: string
  title: string
  description: string
  handle: string
  images: string[]
  price: string
  currency: string
  tags: string[]
  relatedProducts: RelatedProduct[]
  variantId?: string
  availableForSale?: boolean
  variants?: {
    id: string
    title: string
    availableForSale: boolean
    quantityAvailable: number
    price: string
  }[]
}

type RelatedProduct = {
  id: string
  title: string
  handle: string
  images: string[]
  price: string
  currency: string
}

type ProductClientProps = {
  product: Product
  relatedProducts: RelatedProduct[]
}

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
  const { addToCart, checkout, syncCart, checkoutUrl } = useCart()

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
    const selectedVariant = product.variants?.find(v => v.id === variantId)

    console.log(
      'Selecionado:',
      selectedVariant?.title || 'Variante não encontrada'
    )

    setSelectedVariantId(variantId)
    setQuantity(1)
  }

  // const handleBuyNow = async () => {
  //   if (!isAvailable) {
  //     alert('Este produto está esgotado.')
  //     return
  //   }

  //   setIsLoading(true)
  //   try {
  //     const item = {
  //       id: product.id,
  //       variantId: selectedVariantId,
  //       title: product.title,
  //       price: variantPrice,
  //       image:
  //         product.images && product.images.length > 0 ? product.images[0] : '',
  //     }

  //     // Adiciona o item ao carrinho (cria o carrinho se não existir)
  //     await addToCart(item, quantity, false)

  //     // Sincroniza o carrinho para garantir que está atualizado
  //     await syncCart()

  //     // Garante que o checkoutUrl está definido antes de prosseguir
  //     if (!checkoutUrl) {
  //       console.error('Checkout URL is not available.')
  //       throw new Error('Checkout URL não disponível.')
  //     }

  //     // Redireciona para o checkout
  //     checkout()
  //   } catch (error) {
  //     console.error('Error during buy now:', error)
  //     alert(
  //       `Erro ao processar a compra: ${
  //         error instanceof Error ? error.message : 'Erro desconhecido'
  //       }`
  //     )
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  return (
    <main className="2xl:max-w-[1560px] max-w-[1280px] mx-auto px-4 2xl:px-0 mt-4">
      {/* <div>
        <h1>Debugging Product</h1>
        <pre>{JSON.stringify(product, null, 2)}</pre>
      </div> */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {product.images && product.images.length > 0 ? (
            <div>
              <Image
                src={product.images[0] || '/placeholder.svg'}
                alt={product.title || ''}
                width={715}
                height={600}
                className="rounded-lg w-full h-auto object-cover opacity-80 hover:opacity-100 "
                priority
              />

              {/* grid */}
              {product.images.length > 1 && (
                <div className="grid lg:grid-cols-3 grid-cols-3 lg:gap-4 gap-2 mt-4">
                  {product.images.slice(1).map((img, index) => (
                    <Image
                      key={`product-image-${
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        index
                      }`}
                      src={img || '/placeholder.svg'}
                      alt={`${product.title || 'Produto'} - ${index + 2}`}
                      width={400}
                      height={400}
                      className="rounded-md object-cover opacity-80 hover:opacity-100"
                    />
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

        {/* Detalhes do produto */}
        <div className=" w-full">
          <div className="flex flex-col lg:space-y-8 space-y-4">
            <div className="font-bergenregular uppercase text-sm tracking-tighter text-brain-span">
              <span>brain co.</span>
            </div>
            <div className="space-y-4 font-windsor">
              <h1 className="lg:text-5xl text-4xl">
                {product.title || 'Titulo indisponivel'}
              </h1>
              {formattedPrice && <p className="text-3xl">{formattedPrice}</p>}
              <div className="h-[1px] w-11/12 mx-auto bg-gradient-to-r from-brain-hover/5 via-brain-span to-brain-hover/5" />
            </div>

            {/* disponibilidade */}
            {!isAvailable && (
              <p className="text-sm text-red-600">Produto esgotado</p>
            )}
          </div>

          {/* seção de compra */}
          <div className="mt-6">
            {product.variants && product.variants.length > 0 && (
              <VariantSelector
                variants={product.variants}
                onVariantChange={handleVariantChange}
                defaultVariantId={product.variantId}
              />
            )}

            <QuantitySelector
              initialQuantity={1}
              onChange={setQuantity}
              disabled={!isAvailable}
            />

            <div className="mt-4 space-y-3 flex flex-col">
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
              {/* <button
                type="button"
                className={`w-full py-3 rounded-2xl text-lg font-bergenregular uppercase ${
                  isAvailable
                    ? 'bg-brain-span text-black hover:brightness-125 hover:text-brain-green'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!isAvailable || isLoading}
                onClick={handleBuyNow}
              >
                {isLoading
                  ? 'Processando...'
                  : isAvailable
                    ? 'Comprar Agora'
                    : 'Produto Esgotado'}
              </button> */}
            </div>
          </div>

          <div>
            {product.description && (
              <div
                className="space-y-4 opacity-90 my-4 font-extralight"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            <ShareButton />
          </div>
        </div>
      </div>

      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6 font-albra">
            Produtos Relacionados
          </h2>
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
