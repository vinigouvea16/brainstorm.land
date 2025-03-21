import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import ProductClient from './page-client'

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
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

    const res = await fetch(`${baseUrl}/api/shopify/products/${handle}`, {
      // next: { revalidate: 3600 },
      next: { revalidate: 30 },
    })

    if (!res.ok) return null

    const data = await res.json()
    // console.log('dynamic page data', data)

    return {
      ...data,
      images: data.images || [],
      description: data.description || '',
      relatedProducts: data.relatedProducts || [],
    }
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
