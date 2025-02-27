import Image from 'next/image'
import Link from 'next/link'
import Button from './button'

interface ProductCardProps {
  tag: string
  imageUrl: string
  imageAlt?: string
  title: string
  price: string
  description: string
  productLink: string
}

export default function ProductCard({
  tag,
  imageUrl,
  imageAlt = 'Produto',
  title,
  price,
  description,
  productLink,
}: ProductCardProps) {
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
          {/* tag */}
          <div className="uppercase font-bergensemi tracking-wide text-brain-text">
            {tag}
          </div>
          <div className="font-windsor flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
            <h2 className="text-4xl md:text-6xl leading-tight">{title}</h2>
            <h3 id="price" className="text-2xl md:text-3xl">
              {price}
            </h3>
          </div>
          <div id="description">
            <p className="opacity-75 text-base md:text-xl font-windsor tracking-tight">
              {description}
            </p>
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
