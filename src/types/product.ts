export type Product = {
  id: string
  title: string
  description: string
  handle: string
  images: string[]
  price: string
  currency: string
  tags: string[]
  availableForSale?: boolean
  variantId?: string
  variants?: ProductVariant[]
  metafields?: Array<{
    namespace: string
    key: string
    value: string
  }>
}

export type ProductVariant = {
  id: string
  title: string
  availableForSale: boolean
  quantityAvailable: number
  price: string
}

export type RelatedProduct = {
  id: string
  title: string
  handle: string
  images: string[]
  price: string
  currency: string
  availableForSale: boolean
}

export type ProductResult = {
  product: Product | null
  relatedProducts: RelatedProduct[]
}

export type ProductSuggestionsProps = {
  products: RelatedProduct[]
  currentProductId: string
}

export type ProductClientProps = {
  product: Product
  relatedProducts: RelatedProduct[]
}

export type ProductCardProps = {
  id: string
  title: string
  description: string
  imageUrl: string
  price: string
  currency: string
  tags: string
  handle: string
  productLink: string
  imageAlt?: string
}
