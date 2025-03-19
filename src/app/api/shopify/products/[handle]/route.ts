import { type NextRequest, NextResponse } from 'next/server'

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  throw new Error(
    'As variáveis de ambiente SHOPIFY_STORE_DOMAIN e SHOPIFY_STOREFRONT_ACCESS_TOKEN não estão definidas.'
  )
}

export async function GET(
  req: NextRequest,
  { params }: { params: { handle: string } }
) {
  const { handle } = params

  if (!handle) {
    return NextResponse.json(
      { error: 'Parâmetro "handle" é obrigatório' },
      { status: 400 }
    )
  }

  console.log('🔍 Buscando produto com handle:', handle)

  const query = {
    query: `
      query getProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          descriptionHtml
          handle
          images(first: 10) {
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
        products(first: 5) {
          edges {
            node {
              id
              title
              handle
              images(first: 2) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: { handle },
  }

  try {
    console.log('📡 Enviando requisição para Shopify API')
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
      console.error(
        '❌ Resposta da API não ok:',
        response.status,
        response.statusText
      )
      throw new Error(`Erro ao buscar produto: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('✅ Resposta da API recebida')

    const product = result?.data?.productByHandle
    const allProducts = result?.data?.products?.edges || []

    if (!product) {
      console.error('❌ Produto não encontrado na resposta')
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    const relatedProducts = allProducts
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      .map((edge: any) => ({
        id: edge.node.id,
        title: edge.node.title,
        handle: edge.node.handle,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        images: edge.node.images.edges.map((img: any) => img.node.url),
      }))
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      .filter((p: any) => p.id !== product.id)
      .slice(0, 4)

    console.log('✅ Produtos relacionados processados:', relatedProducts.length)

    return NextResponse.json({
      id: product.id,
      title: product.title,
      description: product.descriptionHtml,
      handle: product.handle,
      images: product.images.edges.map(
        (img: { node: { url: string } }) => img.node.url
      ),
      price:
        product.variants.edges.length > 0
          ? product.variants.edges[0].node.priceV2.amount
          : '0.00',
      currency:
        product.variants.edges.length > 0
          ? product.variants.edges[0].node.priceV2.currencyCode
          : 'BRL',
      tags: product.tags || [],
      relatedProducts,
    })
  } catch (error) {
    console.error('❌ Erro ao buscar produto da Shopify:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produto' },
      { status: 500 }
    )
  }
}
