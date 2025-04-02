'use client'

import { useEffect } from 'react'
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

interface WindowWithDataLayer extends Window {
  dataLayer: unknown[]
}

export default function GA4Debug() {
  const pathname = usePathname()

  useEffect(() => {
    // This function will help us debug GA4 issues
    const debugGA4 = () => {
      console.log('GA4 Debug: Starting diagnostics...')

      // Check if gtag is properly loaded
      if (typeof window.gtag !== 'function') {
        console.error('GA4 Debug: gtag is not loaded properly')
      } else {
        console.log('GA4 Debug: gtag is properly loaded')
      }

      // Check if GA ID is set
      const gaId = process.env.NEXT_PUBLIC_GA_ID
      console.log('GA4 Debug: GA ID from env:', gaId)

      // Check for GA script tags
      const gaScripts = document.querySelectorAll(
        'script[src*="googletagmanager"]'
      )
      if (gaScripts.length === 0) {
        console.error('GA4 Debug: No Google Tag Manager scripts found')
      } else {
        console.log(
          'GA4 Debug: Google Tag Manager scripts found:',
          gaScripts.length
        )

        for (const script of Array.from(gaScripts)) {
          console.log('GA4 Script:', script.getAttribute('src'))
        }
      }

      // Check for dataLayer
      const windowWithDataLayer = window as unknown as WindowWithDataLayer
      if (!windowWithDataLayer.dataLayer) {
        console.error('GA4 Debug: dataLayer is not defined')
      } else {
        console.log(
          'GA4 Debug: dataLayer is defined',
          windowWithDataLayer.dataLayer
        )
      }

      // Try to manually send a test event
      if (typeof window.gtag === 'function') {
        try {
          window.gtag('event', 'debug_test', {
            event_category: 'debugging',
            event_label: pathname,
            debug_mode: true,
          })
          console.log('GA4 Debug: Test event sent successfully')
        } catch (error) {
          console.error('GA4 Debug: Error sending test event', error)
        }
      }
    }

    // Run the debug function after a short delay to ensure everything is loaded
    setTimeout(debugGA4, 2000)
  }, [pathname])

  return null
}
