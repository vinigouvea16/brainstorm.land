import { type NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    // Verificar o secret do webhook
    const secret = request.headers.get('Prismic-Webhook-Secret')

    if (!process.env.PRISMIC_WEBHOOK_SECRET) {
      console.error('PRISMIC_WEBHOOK_SECRET não está configurado')
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      )
    }

    if (secret !== process.env.PRISMIC_WEBHOOK_SECRET) {
      console.error('Secret inválido:', secret)
      return NextResponse.json(
        { message: 'Invalid secret token' },
        { status: 401 }
      )
    }

    // Log para debug
    console.log('Revalidando cache do Prismic...', new Date().toISOString())

    // Revalidar cache
    revalidateTag('prismic')

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: 'Cache revalidated successfully',
    })
  } catch (error) {
    console.error('Erro na revalidação:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: String(error) },
      { status: 500 }
    )
  }
}

// Opcional: GET para testar se a rota está funcionando
export async function GET() {
  return NextResponse.json({
    message: 'Revalidate endpoint is working',
    timestamp: new Date().toISOString(),
  })
}
