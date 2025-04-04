import { shopify } from '@/lib/shopify'
import { type NextRequest, NextResponse } from 'next/server'

type Product = {
  id: string
  title: string
  handle: string
  images: string[]
  availableForSale: boolean
  price: string
  currency: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params
  const { searchParams } = new URL(request.url)
  const region = searchParams.get('region') || 'BR'

  try {
    const product = await shopify.product.getByHandle(handle, region)
    const allProducts = await shopify.product.list(region)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const allProductsArray: Product[] = allProducts
      .map((edge: unknown) => {
        if (
          typeof edge !== 'object' ||
          edge === null ||
          !('node' in edge) ||
          typeof edge.node !== 'object' ||
          edge.node === null
        ) {
          return null
        }

        const node = edge.node as {
          id: string
          title: string
          handle: string
          images: { edges: { node: { url: string } }[] }
          availableForSale: boolean
          variants?: {
            edges: {
              node: { price: { amount: string; currencyCode: string } }
            }[]
          }
          priceRange?: {
            minVariantPrice?: { amount: string; currencyCode: string }
          }
        }

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
          images: node.images.edges.map(img => img.node.url),
          availableForSale: node.availableForSale,
          price,
          currency,
        }
      })
      .filter(Boolean) as Product[]

    const availableProducts = allProductsArray.filter(
      p => p.availableForSale && p.id !== product.id
    )

    const relatedProducts = availableProducts
      .sort(() => 0.5 - Math.random())
      .slice(0, 4)

    return NextResponse.json({ product, relatedProducts })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
