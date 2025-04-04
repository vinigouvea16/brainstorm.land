'use client'

import { useRegion } from '@/contexts/region-context'

export default function RegionBanner() {
  const { region, isEurope, isBrazil } = useRegion()

  // Conteúdo específico para cada região
  const bannerContent = {
    BR: {
      title: 'Frete Grátis para todo o Brasil!',
      subtitle: 'Em compras acima de R$ 299',
      bgColor: 'bg-gradient-to-r from-green-700 to-yellow-500',
    },
    EU: {
      title: 'Envio Gratuito para toda a Europa!',
      subtitle: 'Em compras acima de €99',
      bgColor: 'bg-gradient-to-r from-blue-700 to-yellow-500',
    },
  }

  const content = bannerContent[region]

  return (
    <div className={`w-full py-2 ${content.bgColor} text-white text-center`}>
      <p className="font-semibold">{content.title}</p>
      <p className="text-sm">{content.subtitle}</p>
    </div>
  )
}
