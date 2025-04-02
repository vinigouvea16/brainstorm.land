'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void
  }
}

export default function SearchParamsTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!searchParams || !window.gtag) return

    const utmParams = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
    ]
    const hasUtm = utmParams.some(param => searchParams.has(param))

    if (hasUtm) {
      const utmData: Record<string, string> = {}

      // Using for...of instead of forEach
      for (const param of utmParams) {
        const value = searchParams.get(param)
        if (value) {
          utmData[param] = value
          localStorage.setItem(param, value)
        }
      }

      window.gtag('event', 'campaign_referred', utmData)
    }
  }, [searchParams])

  return null
}
