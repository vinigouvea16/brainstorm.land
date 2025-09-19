import { type NextRequest, NextResponse } from 'next/server'

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
  throw new Error(
    'As variáveis de ambiente SHOPIFY_STORE_DOMAIN e SHOPIFY_ADMIN_ACCESS_TOKEN não estão definidas.'
  )
}

type AdminProductVariant = {
  id: string
  price: string
  available: boolean
}

type AdminProductImage = {
  src: string
  alt?: string
}

type AdminProductNode = {
  id: string
  title: string
  body_html: string
  handle: string
  status: string
  images: AdminProductImage[]
  variants: AdminProductVariant[]
  tags: string
}

type AdminCollection = {
  id: string
  handle: string
  title: string
}

type AdminCollectionsResponse = {
  collections: AdminCollection[]
}

type AdminProductsResponse = {
  products: AdminProductNode[]
}

export type FormattedProduct = {
  id: string
  title: string
  description: string
  handle: string
  imageUrl: string
  price: string
  currency: string
  tags: string
  availableForSale: boolean
  status: string
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url)
  const includeDrafts = searchParams.get('drafts') === 'true'

  try {
    // Buscar produtos diretamente, sem filtrar por coleção primeiro
    const status = includeDrafts ? '' : '&status=active'
    const productsResponse = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/admin/api/2023-10/products.json?limit=50${status}`,
      {
        method: 'GET',
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN as string,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!productsResponse.ok) {
      throw new Error(`Erro ao buscar produtos: ${productsResponse.statusText}`)
    }

    const productsData: AdminProductsResponse = await productsResponse.json()
    const products = productsData.products || []

    // Filtrar apenas produtos que tenham as tags relevantes
    const relevantProducts = products.filter((product: AdminProductNode) => {
      const tags = product.tags.toLowerCase()
      return (
        tags.includes('para nutrir') ||
        tags.includes('para vestir') ||
        tags.includes('para elevar') ||
        product.handle === 'trio-suplementares'
      )
    })

    const formattedProducts: FormattedProduct[] = relevantProducts.map(
      (product: AdminProductNode) => {
        // Determinar categoria baseada nas tags
        let category = 'para nutrir' // default
        const tags = product.tags.toLowerCase()
        if (tags.includes('para vestir')) category = 'para vestir'
        if (tags.includes('para elevar')) category = 'para elevar'

        return {
          id: product.id,
          title: product.title,
          description: product.body_html,
          handle: product.handle,
          imageUrl: product.images[0]?.src || '',
          price: product.variants[0]?.price || '0',
          currency: 'BRL',
          tags: category,
          availableForSale:
            product.status === 'active' &&
            (product.variants[0]?.available ?? false),
          status: product.status,
        }
      }
    )

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error('Erro ao buscar produtos via Admin API:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos', details: String(error) },
      { status: 500 }
    )
  }
}
