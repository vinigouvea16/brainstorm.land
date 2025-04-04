import { type NextRequest, NextResponse } from 'next/server'
import { geolocation } from '@vercel/functions'

const EUROPEAN_COUNTRIES = [
  'PT',
  'ES',
  'FR',
  'DE',
  'IT',
  'GB',
  'IE',
  'BE',
  'NL',
  'LU',
  'CH',
  'AT',
  'DK',
  'SE',
  'NO',
  'FI',
  'GR',
  'PL',
  'CZ',
  'SK',
  'HU',
  'RO',
  'BG',
  'HR',
  'SI',
  'EE',
  'LV',
  'LT',
  'CY',
  'MT',
]

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const regionCookie = request.cookies.get('user-region')

  if (!regionCookie) {
    const { country } = geolocation(request)

    const region = EUROPEAN_COUNTRIES.includes(country || '') ? 'EU' : 'BR'

    response.cookies.set('user-region', region, {
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    console.log(
      `Middleware: Região detectada e definida como ${region} (País: ${country})`
    )
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Corresponde a todas as rotas exceto:
     * 1. /api (rotas de API)
     * 2. /_next (arquivos do Next.js)
     * 3. /_vercel (arquivos do Vercel)
     * 4. /favicon.ico, /sitemap.xml, /robots.txt (arquivos estáticos)
     */
    '/((?!api|_next|_vercel|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
