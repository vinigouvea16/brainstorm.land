import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import ProductClient from './page-client'
import { shopify } from '@/lib/shopify'

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
  availableForSale: boolean
  id: string
  title: string
  handle: string
  images: string[]
  price: string
  currency: string
}

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params
  const product = await getProduct(resolvedParams.handle)

  if (!product) {
    return {
      title: 'Produto não encontrado',
    }
  }

  const description = product.description
    ? product.description.replace(/<[^>]*>/g, '').slice(0, 160)
    : 'Sem descrição disponível'

  return {
    title: `${product.title} | Brain Co.`,
    description,
    openGraph: {
      images:
        product.images && product.images.length > 0 ? [product.images[0]] : [],
    },
  }
}

async function getProduct(handle: string): Promise<Product | null> {
  try {
    const shopifyProduct = await shopify.product.getByHandle(handle)

    if (!shopifyProduct) {
      return null
    }

    const allProducts = await shopify.product.list()

    const availableProducts = allProducts
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      .map((edge: any) => {
        const node = edge.node
        return {
          id: node.id,
          title: node.title,
          handle: node.handle,
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          images: node.images.edges.map((img: any) => img.node.url),
          price: node.priceRange?.minVariantPrice?.amount || '0',
          currency: node.priceRange?.minVariantPrice?.currencyCode || 'BRL',
          availableForSale: node.availableForSale,
        }
      })
      .filter(
        (p: RelatedProduct) => p.availableForSale && p.id !== shopifyProduct.id
      )

    const relatedProducts = availableProducts
      .sort(() => 0.5 - Math.random())
      .slice(0, 4)

    return {
      product: shopifyProduct,
      id: shopifyProduct.id,
      title: shopifyProduct.title,
      description: shopifyProduct.description || '',
      handle: shopifyProduct.handle,
      images: shopifyProduct.images || [],
      price: shopifyProduct.price || '0',
      currency: shopifyProduct.currency || 'BRL',
      tags: shopifyProduct.tags || [],
      relatedProducts,
      availableForSale: shopifyProduct.availableForSale || false,
      variants: shopifyProduct.variants || [],
      variantId: shopifyProduct.variantId || '',
    } as unknown as Product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params
  const product = await getProduct(resolvedParams.handle)
  // console.log('Produto recebido no server component:', product)
  if (!product) {
    notFound()
  }

  return (
    <ProductClient
      product={product.product}
      relatedProducts={product.relatedProducts}
    />
  )
}
