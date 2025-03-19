import { type NextRequest, NextResponse } from 'next/server'

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  throw new Error(
    'As variáveis de ambiente SHOPIFY_STORE_DOMAIN e SHOPIFY_STOREFRONT_ACCESS_TOKEN não estão definidas.'
  )
}

type ProductEdge = {
  node: {
    id: string
    title: string
    descriptionHtml: string
    handle: string
    images: {
      edges: { node: { url: string; altText?: string } }[]
    }
    variants: {
      edges: {
        node: {
          id: string
          title: string
          priceV2: { amount: string; currencyCode: string }
        }
      }[]
    }
    tags: string[]
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const query = {
    query: `
      query getAllProducts {
        products(first: 20) {
          edges {
            node {
              id
              title
              descriptionHtml
              handle
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
                    title
                    priceV2 {
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
    // console.log(
    //   'Resposta completa da Shopify:',
    //   JSON.stringify(result, null, 2)
    // )

    const products = result?.data?.products?.edges || []

    return NextResponse.json(
      products.map((edge: ProductEdge) => ({
        id: edge.node.id,
        title: edge.node.title,
        description: edge.node.descriptionHtml,
        handle: edge.node.handle,
        imageUrl: edge.node.images.edges[0]?.node.url || '',
        price: edge.node.variants.edges[0]?.node.priceV2.amount || '0.00',
        currency:
          edge.node.variants.edges[0]?.node.priceV2.currencyCode || 'USD',
        tags: edge.node.tags.length > 0 ? edge.node.tags[0] : '',
      }))
    )
  } catch (error) {
    console.error('Erro ao buscar produtos da Shopify:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    )
  }
}
