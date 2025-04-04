'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { getCookie, setCookie } from 'cookies-next/client'

type Region = 'BR' | 'EU'

type RegionContextType = {
  region: Region
  setRegion: (region: Region) => void
  isLoading: boolean
  currencySymbol: string
  currencyCode: string
  language: string
  isEurope: boolean
  isBrazil: boolean
}

const RegionContext = createContext<RegionContextType | undefined>(undefined)

export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegionState] = useState<Region>('BR')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const regionFromCookie = getCookie('user-region') as Region | undefined
    if (
      regionFromCookie &&
      (regionFromCookie === 'BR' || regionFromCookie === 'EU')
    ) {
      setRegionState(regionFromCookie)
    }
    setIsLoading(false)
  }, [])

  const setRegion = (newRegion: Region) => {
    setRegionState(newRegion)
    setCookie('user-region', newRegion, {
      maxAge: 60 * 60 * 24 * 45, // 45 dias
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'region_change', {
        region: newRegion,
      })
    }

    console.log(`Região alterada para: ${newRegion}`)
  }

  const currencySymbol = region === 'BR' ? 'R$' : '€'
  const currencyCode = region === 'BR' ? 'BRL' : 'EUR'
  const language = region === 'BR' ? 'pt-BR' : 'pt-PT'
  const isEurope = region === 'EU'
  const isBrazil = region === 'BR'

  return (
    <RegionContext.Provider
      value={{
        region,
        setRegion,
        isLoading,
        currencySymbol,
        currencyCode,
        language,
        isEurope,
        isBrazil,
      }}
    >
      {children}
    </RegionContext.Provider>
  )
}

export function useRegion() {
  const context = useContext(RegionContext)
  if (context === undefined) {
    throw new Error('useRegion must be used within a RegionProvider')
  }
  return context
}
