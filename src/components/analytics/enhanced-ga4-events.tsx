'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function EnhancedGA4Events() {
  const pathname = usePathname()
  const previousPathname = useRef<string>('')
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  useEffect(() => {
    // Only run if gtag is available and pathname has changed
    if (
      typeof window.gtag !== 'function' ||
      !gaId ||
      pathname === previousPathname.current
    ) {
      return
    }

    // Function to send page view
    const sendPageView = () => {
      // First, configure the page
      window.gtag('config', gaId, {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      })

      // Then send a separate page_view event for good measure
      window.gtag('event', 'page_view', {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
        send_to: gaId,
      })

      console.log('GA4: Page view sent for', pathname)
      previousPathname.current = pathname
    }

    // Wait a bit to ensure the page title is updated
    setTimeout(sendPageView, 300)
  }, [pathname, gaId])

  return null
}
