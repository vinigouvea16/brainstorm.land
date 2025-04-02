'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void
  }
}

export default function EnhancedGA4Events() {
  const pathname = usePathname()
  const previousPathname = useRef<string>('')
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  useEffect(() => {
    if (
      typeof window.gtag !== 'function' ||
      !gaId ||
      pathname === previousPathname.current
    ) {
      return
    }

    // Function to send page view
    const sendPageView = () => {
      window.gtag('config', gaId, {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      })

      // Also send a separate page_view event for good measure
      window.gtag('event', 'page_view', {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
        send_to: gaId,
      })

      previousPathname.current = pathname
    }

    setTimeout(sendPageView, 300)
  }, [pathname, gaId])

  return null
}
