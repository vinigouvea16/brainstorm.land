// pages/api/shopify/cart/create-checkout.ts

import { NextResponse } from 'next/server'

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

export async function POST(request: Request) {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'Missing Shopify credentials' },
      { status: 500 }
    )
  }

  try {
    const { cartId } = await request.json()

    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      )
    }

    const query = {
      query: `
        mutation checkoutCreate($cartId: ID!) {
          checkoutCreate(input: {
            lineItems: [
              {
                variantId: $cartId, // Aqui você deve passar o variantId correto
                quantity: 1
              }
            ]
          }) {
            checkout {
              id
              webUrl
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        cartId: cartId,
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
      throw new Error(`Error creating checkout: ${response.statusText}`)
    }

    const result = await response.json()

    if (result.data?.checkoutCreate?.userErrors?.length > 0) {
      return NextResponse.json(
        { error: result.data.checkoutCreate.userErrors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        checkoutUrl: result.data.checkoutCreate.checkout.webUrl,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    console.error('Error creating checkout:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout' },
      { status: 500 }
    )
  }
}
