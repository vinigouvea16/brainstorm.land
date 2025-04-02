const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

async function fetchShopify(
  query: string,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  variables: Record<string, any> = {}
) {
  // console.log(`Shopify domain format check: ${SHOPIFY_STORE_DOMAIN}`)
  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Storefront-Access-Token':
            SHOPIFY_STOREFRONT_ACCESS_TOKEN as string,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP Error ${response.status}: ${errorText}`)
    }

    const { data } = await response.json()
    return data
  } catch (error) {
    console.error('Shopify API Error:', error)
    return null
  }
}

const shopify = {
  product: {
    getByHandle: async (handle: string) => {
      const query = `
        query ProductByHandle($handle: String!) {
          productByHandle(handle: $handle) {
            id
            title
            descriptionHtml
            handle
            images(first: 250) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            options {
              name
              values
            }
            variants(first: 250) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  quantityAvailable
                  selectedOptions {
                    name
                    value
                  }
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

      const data = await fetchShopify(query, { handle })

      if (!data?.productByHandle) return null

      const product = data.productByHandle
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const variants = product.variants.edges.map(({ node }: any) => ({
        id: node.id,
        title: node.title,
        availableForSale: node.availableForSale,
        quantityAvailable: node.quantityAvailable,
        price: node.price.amount,
        currencyCode: node.price.currencyCode,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        options: node.selectedOptions.map((opt: any) => ({
          name: opt.name,
          value: opt.value,
        })),
      }))

      return {
        id: product.id,
        title: product.title,
        description: product.descriptionHtml,
        handle: product.handle,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        images: product.images.edges.map(({ node }: any) => node.url),
        variants,
        price: product.priceRange.minVariantPrice.amount,
        currency: product.priceRange.minVariantPrice.currencyCode,
        tags: product.tags,
        availableForSale: product.availableForSale,
        variantId: variants[0]?.id || '',
      }
    },

    list: async () => {
      const query = `
       query Products {
        products(first: 250) {
          edges {
            node {
              id
              title
              handle
              images(first: 10) {
                edges {
                  node {
                    url
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
        }
      }

      `

      const data = await fetchShopify(query)
      return data?.products?.edges || []
    },
  },
}

export { shopify }
