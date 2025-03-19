import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
    SHOPIFY_ACCESS_TOKEN: process.env.SHOPIFY_ACCESS_TOKEN
      ? 'exists'
      : 'missing',
  })
}
