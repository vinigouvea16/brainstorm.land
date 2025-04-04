'use client'

import { useState, useEffect } from 'react'
import { useRegion } from '@/contexts/region-context'
import { MapPin } from 'lucide-react'

export default function RegionModal() {
  const { region, setRegion, isLoading } = useRegion()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<'BR' | 'EU' | null>(null)

  useEffect(() => {
    if (!isLoading && !localStorage.getItem('region-selected')) {
      setIsOpen(true)
    }
  }, [isLoading])

  const handleSelectRegion = (newRegion: 'BR' | 'EU') => {
    setSelectedRegion(newRegion)
  }

  const confirmRegion = () => {
    if (selectedRegion) {
      setRegion(selectedRegion)
      setIsOpen(false)
      localStorage.setItem('region-selected', 'true')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[#0F1111] p-6 rounded-lg max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">Selecione sua região</h2>
          <p className="text-stone-400">
            Detectamos que você está na região{' '}
            <span className="text-brain-span uppercase">
              {region === 'BR' ? 'Brasil' : 'Europa'}
            </span>
            . Confirme ou selecione outra região para uma melhor experiência.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleSelectRegion('BR')}
            className={`p-4 rounded-lg border ${
              selectedRegion === 'BR'
                ? 'border-brain-span bg-brain-span/50'
                : 'border-stone-700 hover:border-brain-span'
            } flex flex-col items-center`}
          >
            <MapPin className="mb-2" />
            <span className="font-medium">Brasil</span>
            <span className="text-sm text-stone-400">R$</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectRegion('EU')}
            className={`p-4 rounded-lg border ${
              selectedRegion === 'EU'
                ? 'border-brain-span bg-brain-span/50'
                : 'border-stone-700 hover:border-brain-span'
            } flex flex-col items-center`}
          >
            <MapPin className="mb-2" />
            <span className="font-medium">Europa</span>
            <span className="text-sm text-stone-400">€</span>
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={confirmRegion}
            disabled={!selectedRegion}
            className="text-base text-stone-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:underline underline-offset-4"
          >
            Continuar com{' '}
            <span className="">
              {selectedRegion === 'BR'
                ? 'Brasil'
                : selectedRegion === 'EU'
                  ? 'Europa'
                  : region === 'BR'
                    ? 'Brasil'
                    : 'Europa'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
