import { cookies } from 'next/headers'

interface RegionConfig {
  storeDomain: string
  storefrontAccessToken: string
  currency: string
}

type Region = 'BR' | 'EU'

interface ShopifyImage {
  url: string
  altText?: string
}

interface ShopifyPrice {
  amount: string
  currencyCode: string
}

interface ShopifyVariant {
  id: string
  title: string
  availableForSale: boolean
  quantityAvailable: number
  price: ShopifyPrice
}

interface ShopifyMetafield {
  namespace: string
  key: string
  value: string
  type?: string
}

interface ShopifyProductRaw {
  id: string
  title: string
  descriptionHtml: string
  handle: string
  tags: string[]
  availableForSale: boolean
  images: {
    edges: Array<{
      node: ShopifyImage
    }>
  }
  variants: {
    edges: Array<{
      node: ShopifyVariant
    }>
  }
  priceRange: {
    minVariantPrice: ShopifyPrice
  }
  metafields: ShopifyMetafield[]
}

interface ShopifyProduct {
  id: string
  title: string
  description: string
  handle: string
  images: string[]
  variants: Array<{
    id: string
    title: string
    availableForSale: boolean
    quantityAvailable: number
    price: string
    currencyCode: string
  }>
  price: string
  currency: string
  tags: string[]
  availableForSale: boolean
  variantId: string
  metafields: ShopifyMetafield[]
}

interface ShopifyResponse {
  status: number
  body: {
    data?: {
      productByHandle?: ShopifyProductRaw
      products?: {
        edges: Array<{
          node: {
            id: string
            title: string
            handle: string
            images: {
              edges: Array<{
                node: {
                  url: string
                }
              }>
            }
            variants: {
              edges: Array<{
                node: {
                  id: string
                  price: ShopifyPrice
                }
              }>
            }
            tags: string[]
            availableForSale: boolean
          }
        }>
      }
    }
    errors?: Array<{ message: string }>
  }
  region: string
}

const REGION_CONFIG: Record<Region, RegionConfig> = {
  BR: {
    storeDomain:
      process.env.SHOPIFY_STORE_DOMAIN ||
      process.env.SHOPIFY_STORE_DOMAIN_BR ||
      '',
    storefrontAccessToken:
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_BR ||
      '',
    currency: 'BRL',
  },
  EU: {
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN_EU || '',
    storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN_EU || '',
    currency: 'EUR',
  },
}

export async function getShopifyConfig(region?: string): Promise<RegionConfig> {
  if (region && (region === 'BR' || region === 'EU')) {
    return REGION_CONFIG[region]
  }
  const cookieStore = await cookies()
  const regionCookie = cookieStore.get('user-region')
  const regionFromCookie = (regionCookie?.value as Region) || 'BR'
  return REGION_CONFIG[regionFromCookie]
}

export async function shopifyFetch({
  query,
  variables,
  region = 'BR',
}: {
  query: string
  variables?: Record<string, unknown>
  region?: string
}): Promise<ShopifyResponse> {
  const config = await getShopifyConfig(region)
  try {
    const result = await fetch(
      `https://${config.storeDomain}/api/2023-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': config.storefrontAccessToken,
        },
        body: JSON.stringify({ query, variables }),
      }
    )
    return {
      status: result.status,
      body: await result.json(),
      region: config.currency,
    }
  } catch (error) {
    return {
      status: 500,
      body: { errors: [{ message: 'Error fetching data' }] },
      region: config.currency,
    }
  }
}

const shopify = {
  product: {
    getByHandle: async (
      handle: string,
      region = 'BR'
    ): Promise<ShopifyProduct | null> => {
      try {
        const query = `
          query ProductByHandle($handle: String!) {
            productByHandle(handle: $handle) {
              id
              title
              descriptionHtml
              handle
              tags
              availableForSale
              images(first: 10) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 250) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    quantityAvailable
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              metafields(identifiers: [
                {namespace: "structured", key: "data"},
                {namespace: "custom", key: "structured_data"},
                {namespace: "product", key: "structured_data"}
              ]) {
                namespace
                key
                value
                type
              }
            }
          }
        `
        const variables = { handle }
        const response = await shopifyFetch({ query, variables, region })

        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const { data } = response.body
        if (!data?.productByHandle) {
          return null
        }

        const product = data.productByHandle

        // Processar metafields
        const metafields = product.metafields || []

        const variants = product.variants.edges.map(edge => ({
          id: edge.node.id,
          title: edge.node.title,
          availableForSale: edge.node.availableForSale,
          quantityAvailable: edge.node.quantityAvailable,
          price: edge.node.price.amount,
          currencyCode: edge.node.price.currencyCode,
        }))

        const price = product.priceRange.minVariantPrice.amount
        const currency = product.priceRange.minVariantPrice.currencyCode

        const finalProduct: ShopifyProduct = {
          id: product.id,
          title: product.title,
          description: product.descriptionHtml,
          handle: product.handle,
          images: product.images.edges.map(edge => edge.node.url),
          variants: variants,
          price: price,
          currency: currency,
          tags: product.tags,
          availableForSale: product.availableForSale,
          variantId: variants[0]?.id || '',
          metafields: metafields,
        }

        return finalProduct
      } catch (error) {
        return null
      }
    },

    list: async (region = 'BR') => {
      try {
        const query = `
          query Products {
            products(first: 250) {
              edges {
                node {
                  id
                  title
                  handle
                  images(first: 5) {
                    edges {
                      node {
                        url
                      }
                    }
                  }
                  variants(first: 1) {
                    edges {
                      node {
                        id
                        price {
                          amount
                          currencyCode
                        }
                      }
                    }
                  }
                  tags
                  availableForSale
                }
              }
            }
          }
        `
        const response = await shopifyFetch({ query, region })
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const { data } = response.body
        return data?.products?.edges || []
      } catch (error) {
        return []
      }
    },
  },
}

export { shopify }
export type { ShopifyProduct, ShopifyMetafield, Region }
