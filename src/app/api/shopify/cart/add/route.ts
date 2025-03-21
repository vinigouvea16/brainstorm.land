import { type NextRequest, NextResponse } from 'next/server'

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

export async function POST(request: NextRequest) {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'Missing Shopify credentials' },
      { status: 500 }
    )
  }

  try {
    const { cartId, variantId, quantity } = await request.json()

    if (!cartId || !variantId || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const query = {
      query: `
        mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
              id
              lines(first: 100) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        title
                        product {
                          title
                        }
                      }
                    }
                  }
                }
              }
              estimatedCost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        cartId,
        lines: [
          {
            quantity,
            merchandiseId: variantId,
          },
        ],
      },
    }

    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
      }
    )

    if (!response.ok) {
      throw new Error(`Error adding to cart: ${response.statusText}`)
    }

    const { data } = await response.json()

    if (data?.cartLinesAdd?.userErrors?.length > 0) {
      console.error(
        'Erros de usuário da API Shopify:',
        data.cartLinesAdd.userErrors
      )

      const outOfStockError = data.cartLinesAdd.userErrors.find(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (error: any) =>
          error.message.includes('esgotou') ||
          error.message.includes('out of stock')
      )

      if (outOfStockError) {
        return NextResponse.json(
          {
            error: 'product_out_of_stock',
            message: outOfStockError.message,
            details: data.cartLinesAdd.userErrors,
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        {
          error: data.cartLinesAdd.userErrors[0].message,
          details: data.cartLinesAdd.userErrors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        cart: data.cartLinesAdd.cart,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}
