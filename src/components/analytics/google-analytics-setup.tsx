'use client'

import { useEffect } from 'react'

// Only declare gtag, not dataLayer
declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    gtag: (command: string, action: string, params?: any) => void
  }
}

export default function GoogleAnalyticsSetup({ gaId }: { gaId: string }) {
  useEffect(() => {
    // Initialize dataLayer if it doesn't exist using type assertion
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    ;(window as any).dataLayer = (window as any).dataLayer || []

    // Define gtag function
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    function gtag(...args: any[]) {
      // biome-ignore lint/style/noArguments: <explanation>
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      ;(window as any).dataLayer.push(arguments)
    }

    // Assign gtag to window
    window.gtag = gtag

    // Initialize gtag with your GA ID
    gtag('js', new Date())
    gtag('config', gaId, {
      send_page_view: false, // We'll handle page views separately
    })

    console.log('GA4 Setup: Initialized with ID', gaId)
  }, [gaId])

  return null
}
