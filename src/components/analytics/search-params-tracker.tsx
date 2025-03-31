'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function SearchParamsTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!searchParams || !window.gtag) return

    // Rastrear parâmetros de busca
    window.gtag('event', 'search_params', {
      search_params: searchParams.toString(),
    })

    // Rastrear UTMs
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

      // biome-ignore lint/complexity/noForEach: <explanation>
      utmParams.forEach(param => {
        const value = searchParams.get(param)
        if (value) {
          utmData[param] = value
          localStorage.setItem(param, value)
        }
      })

      window.gtag('event', 'campaign_referred', utmData)
    }
  }, [searchParams])

  return null
}
