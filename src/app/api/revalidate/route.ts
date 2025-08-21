import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  const secret = request.headers.get('Prismic-Webhook-Secret')

  if (secret !== process.env.PRISMIC_WEBHOOK_SECRET) {
    return NextResponse.json(
      { message: 'Invalid secret token' },
      { status: 401 }
    )
  }

  revalidateTag('prismic')

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
