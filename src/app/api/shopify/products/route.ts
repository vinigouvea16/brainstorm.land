import { shopifyFetch } from '@/lib/shopify'
import { type NextRequest, NextResponse } from 'next/server'

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  throw new Error(
    'As variáveis de ambiente SHOPIFY_STORE_DOMAIN e SHOPIFY_STOREFRONT_ACCESS_TOKEN não estão definidas.'
  )
}

type ShopifyProductNode = {
  id: string
  title: string
  handle: string
  descriptionHtml: string
  availableForSale: boolean
  priceRange: {
    minVariantPrice: {
      amount: string
      currencyCode: string
    }
  }
  images: {
    edges: Array<{
      node: {
        url: string
        altText?: string
      }
    }>
  }
  variants: {
    edges: Array<{
      node: {
        id: string
        availableForSale: boolean
        price: {
          amount: string
          currencyCode: string
        }
      }
    }>
  }
  tags: string[]
}

type CollectionProductEdge = {
  node: ShopifyProductNode
}

type CollectionNode = {
  handle: string
  products: {
    edges: CollectionProductEdge[]
  }
}

type CollectionEdge = {
  node: CollectionNode
}

type ProductEdge = {
  node: ShopifyProductNode
}

type FormattedProduct = {
  id: string
  title: string
  description: string
  handle: string
  imageUrl: string
  price: string
  currency: string
  tags: string
  availableForSale: boolean
  collectionOrder: boolean
}

const COLLECTION_MAPPING = {
  'para vestir': 'para-vestir',
  'para nutrir': 'para-nutrir',
  'para elevar': 'para-elevar',
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const query = {
    query: `
      query getProductsByCollections {
        collections(first: 10, query: "handle:para-vestir OR handle:para-nutrir OR handle:para-elevar") {
          edges {
            node {
              handle
              products(first: 20) {
                edges {
                  node {
                    id
                    title
                    descriptionHtml
                    handle
                    availableForSale
                    priceRange {
                      minVariantPrice {
                        amount
                        currencyCode
                      }
                    }
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                    variants(first: 1) {
                      edges {
                        node {
                          id
                          availableForSale
                          price {
                            amount
                            currencyCode
                          }
                        }
                      }
                    }
                    tags
                  }
                }
              }
            }
          }
        }
      }
    `,
  }

  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Storefront-Access-Token':
            SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      }
    )

    if (!response.ok) {
      throw new Error(`Erro ao buscar produtos: ${response.statusText}`)
    }

    const result = await response.json()
    const collections = result?.data?.collections?.edges || []

    const productsByCategory: { [key: string]: FormattedProduct[] } = {}

    for (const collectionEdge of collections) {
      const collection = collectionEdge.node
      const collectionHandle = collection.handle

      const category = Object.keys(COLLECTION_MAPPING).find(
        key =>
          COLLECTION_MAPPING[key as keyof typeof COLLECTION_MAPPING] ===
          collectionHandle
      )

      if (category) {
        const products = collection.products.edges.map(
          (productEdge: CollectionProductEdge): FormattedProduct => ({
            id: productEdge.node.id,
            title: productEdge.node.title,
            description: productEdge.node.descriptionHtml,
            handle: productEdge.node.handle,
            imageUrl: productEdge.node.images.edges[0]?.node.url || '',
            price: productEdge.node.priceRange.minVariantPrice.amount,
            currency: productEdge.node.priceRange.minVariantPrice.currencyCode,
            tags: category,
            availableForSale: productEdge.node.availableForSale,
            collectionOrder: true,
          })
        )

        productsByCategory[category] = products
      }
    }

    // Converter o objeto em array plano mantendo a ordem das coleções
    const allProducts: FormattedProduct[] = []
    for (const category of Object.keys(COLLECTION_MAPPING)) {
      if (productsByCategory[category]) {
        allProducts.push(...productsByCategory[category])
      }
    }

    return NextResponse.json(allProducts)
  } catch (error) {
    console.error('Erro ao buscar produtos da Shopify:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { handles, region } = await request.json()

    if (!handles || !Array.isArray(handles) || handles.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or missing product handles' },
        { status: 400 }
      )
    }

    const query = `
      query ProductsByHandles($handles: String!) {
        products(first: 250, query: $handles) {
          edges {
            node {
              id
              title
              handle
              descriptionHtml
              availableForSale
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    availableForSale
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
              tags
            }
          }
        }
      }
    `

    const handleQuery = handles
      .map((handle: string) => `handle:${handle}`)
      .join(' OR ')

    const response = await shopifyFetch({
      query,
      variables: { handles: handleQuery },
    })

    if (response.status !== 200) {
      throw new Error(`Shopify API responded with status ${response.status}`)
    }

    if (!response.body?.data?.products?.edges) {
      return NextResponse.json(
        { error: 'No data received from Shopify API' },
        { status: 500 }
      )
    }

    const edges = response.body.data.products.edges as ProductEdge[]

    const products = edges
      .map((edge: ProductEdge) => {
        const node = edge.node
        if (!node) return null

        return {
          id: node.id,
          title: node.title,
          handle: node.handle,
          description: node.descriptionHtml,
          availableForSale: node.availableForSale,
          price: node.priceRange.minVariantPrice.amount,
          currency: node.priceRange.minVariantPrice.currencyCode,
          image: node.images.edges[0]?.node.url || null,
          variantId: node.variants.edges[0]?.node.id || null,
        }
      })
      .filter(Boolean)

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Error fetching products by handles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
