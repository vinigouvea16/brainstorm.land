'use client'

import { useRegion } from '@/contexts/region-context'

type PriceDisplayProps = {
  amount: string | number
  compareAtAmount?: string | number
  currencyOverride?: string
}

export default function PriceDisplay({
  amount,
  compareAtAmount,
  currencyOverride,
}: PriceDisplayProps) {
  const { currencySymbol, currencyCode } = useRegion()

  // Usar a moeda do contexto ou a substituição, se fornecida
  const currency = currencyOverride || currencyCode
  const symbol =
    currencyOverride === 'EUR'
      ? '€'
      : currencyOverride === 'BRL'
        ? 'R$'
        : currencySymbol

  // Converter para número
  const numericAmount =
    typeof amount === 'string' ? Number.parseFloat(amount) : amount

  // Formatar o preço de acordo com a região
  const formatter = new Intl.NumberFormat(
    currency === 'EUR' ? 'pt-PT' : 'pt-BR',
    {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )

  const formattedPrice = formatter.format(numericAmount)

  // Se houver um preço de comparação (preço original antes do desconto)
  let formattedCompareAtPrice = null
  if (compareAtAmount) {
    const numericCompareAt =
      typeof compareAtAmount === 'string'
        ? Number.parseFloat(compareAtAmount)
        : compareAtAmount

    formattedCompareAtPrice = formatter.format(numericCompareAt)
  }

  return (
    <div className="flex items-baseline">
      <span className="text-2xl font-semibold">{formattedPrice}</span>

      {formattedCompareAtPrice && (
        <span className="ml-2 text-sm line-through text-gray-400">
          {formattedCompareAtPrice}
        </span>
      )}
    </div>
  )
}
