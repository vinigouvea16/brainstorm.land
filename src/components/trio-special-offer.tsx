'use client'

export function TrioSpecialOffer() {
  return (
    <div className="my-4">
      <div className="bg-brain-span/10 border border-brain-span/30 rounded-lg p-6 text-center">
        <p className="text-lg lg:text-xl font-windsor text-brain-span">
          Na compra desse kit economize R$ 47,76 (20%)
        </p>
        <p className="text-sm lg:text-base text-brain-text/70 mt-2">
          comparado à compra individual dos 3 suplementos
        </p>
      </div>

      <p className="text-center my-2 underline underline-offset-4 text-sm lg:text-base">
        Obs: Desconto já aplicado no preço do produto
      </p>
    </div>
  )
}
