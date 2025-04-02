'use client'

import { useEffect } from 'react'

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

export default function GoogleAnalyticsSetup({ gaId }: { gaId: string }) {
  useEffect(() => {
    const windowWithDataLayer = window as unknown as WindowWithDataLayer
    windowWithDataLayer.dataLayer = windowWithDataLayer.dataLayer || []

    function gtag(
      command: string,
      action: string | Date,
      params?: Record<string, unknown>
    ) {
      windowWithDataLayer.dataLayer.push([command, action, params])
    }

    // Assign gtag to window
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    window.gtag = gtag as any

    // Initialize gtag with your GA ID
    gtag('js', new Date())
    gtag('config', gaId, {
      send_page_view: false,
    })
  }, [gaId])

  return null
}
