'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import ProductSuggestions from '@/components/store-components/suggestions'

type Product = {
  imageUrl: string | null
  id: string
  title: string
  description: string
  handle: string
  images: string[]
  price: string
  currency: string
  tags: string[]
  relatedProducts: RelatedProduct[]
}

type RelatedProduct = {
  id: string
  title: string
  handle: string
  images: string[]
}

export default function ProductPage() {
  const { handle } = useParams() as { handle: string }
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        console.log('📡 Buscando produto com handle:', handle)
        const res = await fetch(`/api/shopify/products/${handle}`)

        if (!res.ok) {
          console.error('❌ Resposta não ok:', res.status, res.statusText)
          throw new Error('Produto não encontrado')
        }

        const data = await res.json()
        console.log('✅ Produto carregado:', data)
        setProduct(data)
      } catch (error) {
        console.error('❌ Erro ao buscar produto:', error)
      } finally {
        setLoading(false)
      }
    }

    if (handle) fetchProduct()
  }, [handle])

  if (loading) return <p>Carregando...</p>
  if (!product) return <p>Produto não encontrado</p>

  const increaseQuantity = () => setQuantity(prev => prev + 1)
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1))

  const formattedPrice = `${product.currency} ${Number.parseFloat(
    product.price
  ).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

  return (
    <main className="max-w-[1280px] mx-auto p-4 lg:p-0 mt-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {product.images.length > 0 ? (
            <div>
              <Image
                src={product.images[0] || '/placeholder.svg'}
                alt={product.title}
                width={715}
                height={600}
                className="rounded-lg w-full h-auto object-cover"
                priority
              />

              <div className="grid lg:grid-cols-2 grid-cols-3 lg:gap-4 gap-2 mt-4">
                {product.images.slice(1).map((img, index) => (
                  <Image
                    key={`product-image-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      index
                    }`}
                    src={img || '/placeholder.svg'}
                    alt={`${product.title} - ${index + 2}`}
                    width={400}
                    height={400}
                    className="rounded-md object-cover"
                  />
                ))}
              </div>
            </div>
          ) : (
            <p>Imagem não disponível</p>
          )}
        </div>

        {/* detalhes do produto */}
        <div className="lg:w-4/5 w-full">
          <div className="flex flex-col space-y-4">
            <div className="font-bergenregular uppercase text-xs tracking-tighter text-brain-span">
              <span>brain co.</span>
            </div>
            <h1 className="text-4xl font-semibold">{product.title}</h1>
            <p className="text-2xl font-semibold">{formattedPrice}</p>
          </div>

          {/* botoes de compra */}
          <div className="mt-6">
            <div className="flex items-center space-x-4 border rounded-2xl border-brain-border p-2 w-max">
              <button
                type="button"
                className="px-2 py-1 text-brain-text text-2xl hover:text-brain-span"
                onClick={decreaseQuantity}
              >
                -
              </button>
              <span className="text-lg font-medium w-8 text-center">
                {quantity}
              </span>
              <button
                type="button"
                className="px-2 py-1 text-brain-text text-2xl hover:text-brain-span"
                onClick={increaseQuantity}
              >
                +
              </button>
            </div>

            {/* botoes de acao */}
            <div className="mt-4 space-y-3 flex flex-col">
              <button
                type="button"
                className="w-full border border-brain-border text-brain-text py-3 rounded-2xl text-base font-bergenregular uppercase hover:border-white hover:text-white"
              >
                Adicionar ao Carrinho
              </button>
              <button
                type="button"
                className="w-full bg-brain-span text-black py-3 rounded-2xl text-lg font-bergenregular uppercase hover:brightness-125 hover:text-brain-green"
              >
                Comprar Agora
              </button>
            </div>
          </div>

          {/* descricao do produto */}
          <div
            className="space-y-4 opacity-80 my-4 tracking-tight"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      </div>

      {/* sugestao de produtos */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Produtos Relacionados</h2>
          <ProductSuggestions
            products={product.relatedProducts}
            currentProductId={product.id}
          />
        </div>
      )}
    </main>
  )
}
