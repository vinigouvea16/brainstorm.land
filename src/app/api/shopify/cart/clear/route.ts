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
    const { cartId } = await request.json()

    if (!cartId) {
      return NextResponse.json({ error: 'Missing cartId' }, { status: 400 })
    }

    const getCartQuery = {
      query: `
        query getCart($cartId: ID!) {
          cart(id: $cartId) {
            id
            lines(first: 100) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      `,
      variables: {
        cartId,
      },
    }

    const getCartResponse = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(getCartQuery),
      }
    )

    if (!getCartResponse.ok) {
      throw new Error(`Error getting cart: ${getCartResponse.statusText}`)
    }

    const getCartData = await getCartResponse.json()

    if (!getCartData.data?.cart || !getCartData.data.cart.lines.edges.length) {
      return NextResponse.json({
        success: true,
        message: 'Cart is already empty',
      })
    }

    const lineIds = getCartData.data.cart.lines.edges.map(
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      (edge: any) => edge.node.id
    )

    const clearCartQuery = {
      query: `
        mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
          cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
            cart {
              id
              checkoutUrl
              lines(first: 100) {
                edges {
                  node {
                    id
                  }
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
        lineIds,
      },
    }

    const clearCartResponse = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clearCartQuery),
      }
    )

    if (!clearCartResponse.ok) {
      throw new Error(`Error clearing cart: ${clearCartResponse.statusText}`)
    }

    const clearCartData = await clearCartResponse.json()

    if (clearCartData.data?.cartLinesRemove?.userErrors?.length > 0) {
      return NextResponse.json(
        { error: clearCartData.data.cartLinesRemove.userErrors[0].message },
        { status: 400 }
      )
    }

    const isCartEmpty =
      !clearCartData.data?.cartLinesRemove?.cart?.lines?.edges?.length

    return NextResponse.json(
      {
        success: true,
        isCartEmpty,
        cart: clearCartData.data.cartLinesRemove.cart,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    console.error('Error clearing cart:', error)
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 })
  }
}
