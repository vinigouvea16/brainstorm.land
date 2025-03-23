// app/api/shopify-direct-test/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN
    const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

    const query = `
      {
        shop {
          name
        }
      }
    `

    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Storefront-Access-Token':
            SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        {
          error: `HTTP Error ${response.status}`,
          details: errorText.substring(0, 200),
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
