'use client'
import { Check, Share } from 'lucide-react'
import { useState } from 'react'

export default function ShareButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 6000)
    } catch (error) {
      console.log('Erro ao copiar link:', error)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2 rounded-lg hover:underline transition "
    >
      {copied ? (
        <Check size={20} className="text-green-500" />
      ) : (
        <Share size={20} />
      )}
      {copied ? 'Copiado!' : 'Compartilhar'}
    </button>
  )
}
