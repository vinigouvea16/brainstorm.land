import { cookies } from 'next/headers'

const REGION_CONFIG = {
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

export async function getShopifyConfig(region = 'BR') {
  if (region) {
    return REGION_CONFIG[region as 'BR' | 'EU']
  }
  const cookieStore = await cookies()
  const regionCookie = cookieStore.get('user-region')
  const regionFromCookie = (regionCookie?.value as 'BR' | 'EU') || 'BR'

  return REGION_CONFIG[regionFromCookie]
}

export async function shopifyFetch({
  query,
  variables,
  region = 'BR',
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: { query: string; variables?: any; region?: string }) {
  const config = await getShopifyConfig()

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
    console.error('Error fetching from Shopify:', error)
    return {
      status: 500,
      body: { errors: [{ message: 'Error fetching data' }] },
      region: config.currency,
    }
  }
}

const shopify = {
  product: {
    getByHandle: async (handle: string, region = 'BR') => {
      try {
        const query = `
          query ProductByHandle($handle: String!) {
            productByHandle(handle: $handle) {
              id
              title
              descriptionHtml
              handle
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
              tags
              availableForSale
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

        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const variants = product.variants.edges.map((edge: any) => ({
          id: edge.node.id,
          title: edge.node.title,
          availableForSale: edge.node.availableForSale,
          quantityAvailable: edge.node.quantityAvailable,
          price: edge.node.price.amount,
          currencyCode: edge.node.price.currencyCode,
        }))

        const price = product.priceRange.minVariantPrice.amount
        const currency = product.priceRange.minVariantPrice.currencyCode

        return {
          id: product.id,
          title: product.title,
          description: product.descriptionHtml,
          handle: product.handle,
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          images: product.images.edges.map((edge: any) => edge.node.url),
          variants: variants,
          price: price,
          currency: currency,
          tags: product.tags,
          availableForSale: product.availableForSale,
          variantId: variants[0]?.id || '',
        }
      } catch (error) {
        console.error('Error fetching product by handle:', error)
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
        console.error('Error fetching all products:', error)
        return []
      }
    },
  },
}

export { shopify }
