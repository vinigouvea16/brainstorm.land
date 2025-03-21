'use client'

import { useState, useEffect } from 'react'

type Variant = {
  id: string
  title: string
  availableForSale: boolean
}

type VariantSelectorProps = {
  variants: Variant[]
  onVariantChange: (variantId: string) => void
  defaultVariantId?: string
}

export default function VariantSelector({
  variants,
  onVariantChange,
  defaultVariantId,
}: VariantSelectorProps) {
  const [selectedVariantId, setSelectedVariantId] = useState('')

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!variants.length) return

    const initialVariant =
      variants.find(v => v.id === defaultVariantId) ||
      variants.find(v => v.availableForSale) ||
      variants[0]

    if (initialVariant) {
      setSelectedVariantId(initialVariant.id)
      onVariantChange(initialVariant.id)
    }
  }, [])

  const handleVariantChange = (variantId: string) => {
    setSelectedVariantId(variantId)
    onVariantChange(variantId)
  }

  if (variants.length <= 1) return null

  return (
    <div className="space-y-4 mb-4">
      <div className="block text-sm font-medium mb-2">Tamanho</div>
      <div className="flex flex-wrap gap-2">
        {variants.map(({ id, title, availableForSale }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleVariantChange(id)}
            className={`px-3 py-1 border rounded-md text-sm 
              ${selectedVariantId === id ? 'bg-brain-span text-black border-brain-span' : 'bg-stone-300 text-gray-700 border-gray-300'}
              ${!availableForSale ? 'opacity-40 cursor-not-allowed line-through' : 'hover:border-brain-span'}`}
            disabled={!availableForSale}
          >
            {title}
          </button>
        ))}
      </div>
    </div>
  )
}
