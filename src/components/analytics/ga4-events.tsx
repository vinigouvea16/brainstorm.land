// components/analytics/ga4-events.tsx
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    gtag: (...args: any[]) => void
  }
}

export default function GA4Events() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pathname,
      })
    }
  }, [pathname])

  return null
}
