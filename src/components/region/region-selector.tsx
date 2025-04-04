'use client'

import { useState } from 'react'
import { useRegion } from '@/contexts/region-context'
import { MapPin } from 'lucide-react'

export default function RegionSelector() {
  const { region, setRegion, currencySymbol } = useRegion()
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => setIsOpen(!isOpen)

  const selectRegion = (newRegion: 'BR' | 'EU') => {
    setRegion(newRegion)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex items-center space-x-1 text-lg text-brain-text hover:text-white"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <MapPin size={20} />
        <span>{region === 'BR' ? 'Brasil' : 'Europa'}</span>
        <span className="text-brain-span">{currencySymbol}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-zinc-950/50 border border-brain-border rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              type="button"
              onClick={() => selectRegion('BR')}
              className={`block w-full text-left px-4 py-2 text-sm ${
                region === 'BR'
                  ? 'bg-brain-span/30 text-brain-span'
                  : 'text-brain-text hover:bg-[#0F1111]'
              }`}
            >
              Brasil (R$)
            </button>
            <button
              type="button"
              onClick={() => selectRegion('EU')}
              className={`block w-full text-left px-4 py-2 text-sm ${
                region === 'EU'
                  ? 'bg-brain-span/30 text-brain-span'
                  : 'text-brain-text hover:bg-[#0F1111]'
              }`}
            >
              Europa (€)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
