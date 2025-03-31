'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    gtag: (...args: any[]) => void
  }
}

export default function GA4Events() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Rastrear mudanças de página
  useEffect(() => {
    if (pathname && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pathname,
        page_search: searchParams.toString(),
      })
    }
  }, [pathname, searchParams])

  return null
}
