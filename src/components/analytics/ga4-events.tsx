'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    gtag: (command: string, action: string, params?: any) => void
  }
}

export default function GA4Events() {
  const pathname = usePathname()
  const previousPathname = useRef<string>('')

  useEffect(() => {
    if (window.gtag && pathname !== previousPathname.current) {
      window.gtag('event', 'page_view', {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      })

      console.log('GA4: Página visualizada', pathname)

      previousPathname.current = pathname
    }
  }, [pathname])

  return null
}
