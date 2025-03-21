import { NextResponse } from 'next/server'

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

export async function POST() {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'Missing Shopify credentials' },
      { status: 500 }
    )
  }

  try {
    const query = {
      query: `
        mutation cartCreate {
          cartCreate {
            cart {
              id
              checkoutUrl
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
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
      throw new Error(`Error creating cart: ${response.statusText}`)
    }

    const { data } = await response.json()

    if (data?.cartCreate?.userErrors?.length > 0) {
      return NextResponse.json(
        { error: data.cartCreate.userErrors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        cartId: data.cartCreate.cart.id,
        checkoutUrl: data.cartCreate.cart.checkoutUrl,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    console.error('Error creating cart:', error)
    return NextResponse.json(
      { error: 'Failed to create cart' },
      { status: 500 }
    )
  }
}
