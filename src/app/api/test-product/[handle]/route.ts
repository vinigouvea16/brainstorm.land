// app/api/test-product/[handle]/route.ts
import { shopify } from '@/lib/shopify'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params
    console.log(`Test API: Buscando produto com handle: ${handle}`)

    const product = await shopify.product.getByHandle(handle)

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Retorna apenas os dados essenciais do produto
    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        title: product.title,
        handle: product.handle,
      },
    })
  } catch (error) {
    console.error('Error in test API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
