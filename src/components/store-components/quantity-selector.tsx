'use client'

import { useState } from 'react'

type QuantitySelectorProps = {
  initialQuantity?: number
  onChange?: (quantity: number) => void
  maxQuantity?: number
  disabled?: boolean
}

export default function QuantitySelector({
  initialQuantity = 1,
  onChange,
  maxQuantity,
  disabled = false,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(initialQuantity)

  const increaseQuantity = () => {
    if (maxQuantity !== undefined && quantity >= maxQuantity) {
      return
    }

    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    if (onChange) onChange(newQuantity)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
      if (onChange) onChange(newQuantity)
    }
  }

  return (
    <div
      className={`flex items-center space-x-4 border rounded-2xl border-brain-border p-2 w-max ${disabled ? 'opacity-50' : ''}`}
    >
      <button
        type="button"
        className="px-2 py-1 text-brain-text text-2xl hover:text-brain-span disabled:text-gray-400"
        onClick={decreaseQuantity}
        aria-label="Diminuir quantidade"
        disabled={disabled || quantity <= 1}
      >
        -
      </button>
      <span className="text-lg font-medium w-8 text-center">{quantity}</span>
      <button
        type="button"
        className="px-2 py-1 text-brain-text text-2xl hover:text-brain-span disabled:text-gray-400"
        onClick={increaseQuantity}
        aria-label="Aumentar quantidade"
        disabled={
          disabled || (maxQuantity !== undefined && quantity >= maxQuantity)
        }
      >
        +
      </button>
    </div>
  )
}
