import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import ProductClient from './page-client'
import { shopify } from '@/lib/shopify'
import type { Product, RelatedProduct, ProductResult } from '@/types/product'

type Props = {
  params: Promise<{ handle: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const cookieStore = await cookies()
  const regionCookie = cookieStore.get('user-region')
  const region = regionCookie?.value || 'BR'

  const resolvedParams = await params
  const result = await getProduct(resolvedParams.handle, region)

  if (!result.product) {
    return {
      title: 'Produto não encontrado',
    }
  }

  const description = result.product.description
    ? result.product.description.replace(/<[^>]*>/g, '').slice(0, 160)
    : 'Sem descrição disponível'

  return {
    title: `${result.product.title} | Brain Co.`,
    description,
    openGraph: {
      images:
        result.product.images && result.product.images.length > 0
          ? [result.product.images[0]]
          : [],
    },
  }
}

async function getProduct(
  handle: string,
  region = 'BR'
): Promise<ProductResult> {
  try {
    const shopifyProduct = await shopify.product.getByHandle(handle, region)

    if (!shopifyProduct) {
      return { product: null, relatedProducts: [] }
    }

    const allProducts = await shopify.product.list(region)

    const availableProducts = allProducts
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      .map((edge: any) => {
        const node = edge.node

        const variantPrice = node.variants?.edges[0]?.node?.price?.amount
        const variantCurrency =
          node.variants?.edges[0]?.node?.price?.currencyCode

        const price =
          variantPrice || node.priceRange?.minVariantPrice?.amount || '0'
        const currency =
          variantCurrency ||
          node.priceRange?.minVariantPrice?.currencyCode ||
          'BRL'

        return {
          id: node.id,
          title: node.title,
          handle: node.handle,
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          images: node.images.edges.map((img: any) => img.node.url),
          price,
          currency,
          availableForSale: node.availableForSale,
        }
      })
      .filter(
        (p: RelatedProduct) => p.availableForSale && p.id !== shopifyProduct.id
      )

    const relatedProducts = availableProducts
      .sort(() => 0.5 - Math.random())
      .slice(0, 8)

    return {
      product: {
        id: shopifyProduct.id,
        title: shopifyProduct.title,
        description: shopifyProduct.description || '',
        handle: shopifyProduct.handle,
        images: shopifyProduct.images || [],
        price: shopifyProduct.price || '0',
        currency: shopifyProduct.currency || 'BRL',
        tags: shopifyProduct.tags || [],
        availableForSale: shopifyProduct.availableForSale || false,
        variants: shopifyProduct.variants || [],
        variantId: shopifyProduct.variantId || '',
        metafields: shopifyProduct.metafields || [],
      } as Product,
      relatedProducts,
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return { product: null, relatedProducts: [] }
  }
}

export default async function ProductPage({ params }: Props) {
  const cookieStore = await cookies()
  const regionCookie = cookieStore.get('user-region')
  const region = regionCookie?.value || 'BR'

  const resolvedParams = await params
  const result = await getProduct(resolvedParams.handle, region)
  // console.log('result', result)

  if (!result.product) {
    notFound()
  }

  return (
    <ProductClient
      product={result.product}
      relatedProducts={result.relatedProducts}
    />
  )
}
