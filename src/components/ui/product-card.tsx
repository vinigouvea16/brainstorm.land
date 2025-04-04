import Image from 'next/image'
import Link from 'next/link'
import Button from './button'
import sanitizeHtml from 'sanitize-html'

interface ProductCardProps {
  tags: string
  imageUrl: string
  imageAlt?: string
  title: string
  price: string
  currency?: string
  description: SanitizedHTML
  productLink: string
}

type SanitizedHTML = string

export default function ProductCard({
  tags,
  imageUrl,
  imageAlt = 'Produto',
  title,
  price,
  currency = 'BRL',
  description,
  productLink,
}: ProductCardProps) {
  const cleanDescription = sanitizeHtml(description || '')
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(Number(price))

  return (
    <div className="flex flex-col text-brain-text border-b border-brain-border/25 py-10 items-center space-y-10 lg:flex-row lg:space-y-0">
      {/* image section */}
      <div className="relative w-full h-[420px] lg:w-[380px] lg:h-[420px]">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="rounded-2xl object-cover"
          sizes="(max-width: 768px) 100vw, 380px"
        />
      </div>

      {/* product info and button container */}
      <div className="flex flex-col w-full lg:w-4/5 lg:pl-8 lg:flex-row lg:items-center lg:justify-between items-center ">
        {/* product info */}
        <div className="flex flex-col lg:gap-12 gap-8 lg:w-4/5 w-full">
          {/* tags */}
          <div className="uppercase font-bergensemi tracking-wide text-brain-text">
            {tags}
          </div>
          <div className="font-windsor flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
            <h2 className="text-4xl md:text-6xl leading-tight">{title}</h2>
            <h3 id="price" className="text-2xl md:text-3xl">
              {formattedPrice}
            </h3>
          </div>
          <div
            id="description"
            className="font-windsor xl:text-xl text-lg opacity-80 text-pretty"
          >
            <div
              // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
              dangerouslySetInnerHTML={{ __html: cleanDescription }}
            />
          </div>
        </div>

        {/* button */}
        <div className="mt-4 lg:mt-0">
          <Link href={productLink}>
            <Button>ver produto</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
