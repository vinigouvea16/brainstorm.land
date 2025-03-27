import { type NextRequest, NextResponse } from 'next/server'

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

export async function POST(request: NextRequest) {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'Missing Shopify credentials' },
      { status: 500 }
    )
  }

  try {
    const { cartId, items } = await request.json()

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Se não tiver cartId, criar um novo carrinho
    if (!cartId) {
      console.log('No cart ID provided, creating a new cart')
      const createCartQuery = {
        query: `
          mutation cartCreate {
            cartCreate {
              cart {
                id
                checkoutUrl
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
      }

      const createCartResponse = await fetch(
        `https://${SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`,
        {
          method: 'POST',
          headers: {
            'X-Shopify-Storefront-Access-Token':
              SHOPIFY_STOREFRONT_ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(createCartQuery),
        }
      )

      if (!createCartResponse.ok) {
        throw new Error(`Error creating cart: ${createCartResponse.statusText}`)
      }

      const createCartData = await createCartResponse.json()

      if (createCartData.data?.cartCreate?.userErrors?.length > 0) {
        return NextResponse.json(
          { error: createCartData.data.cartCreate.userErrors[0].message },
          { status: 400 }
        )
      }

      const newCartId = createCartData.data.cartCreate.cart.id
      const checkoutUrl = createCartData.data.cartCreate.cart.checkoutUrl

      // Se não houver itens para adicionar, retornar o novo carrinho vazio
      if (items.length === 0) {
        return NextResponse.json({
          cartId: newCartId,
          checkoutUrl: checkoutUrl,
          lines: [],
          isNewCart: true,
        })
      }

      // Adicionar itens ao novo carrinho
      const addQuery = {
        query: `
          mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
              cart {
                id
                checkoutUrl
                lines(first: 100) {
                  edges {
                    node {
                      id
                      quantity
                      merchandise {
                        ... on ProductVariant {
                          id
                        }
                      }
                    }
                  }
                }
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          cartId: newCartId,
          lines: items.map(item => ({
            merchandiseId: item.variantId,
            quantity: item.quantity,
          })),
        },
      }

      const addResponse = await fetch(
        `https://${SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`,
        {
          method: 'POST',
          headers: {
            'X-Shopify-Storefront-Access-Token':
              SHOPIFY_STOREFRONT_ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(addQuery),
        }
      )

      if (!addResponse.ok) {
        throw new Error(`Error adding lines: ${addResponse.statusText}`)
      }

      const addData = await addResponse.json()

      if (addData.data?.cartLinesAdd?.userErrors?.length > 0) {
        const outOfStockError = addData.data.cartLinesAdd.userErrors.find(
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          (error: any) =>
            error.message.includes('esgotou') ||
            error.message.includes('out of stock')
        )

        if (outOfStockError) {
          return NextResponse.json(
            {
              error: 'product_out_of_stock',
              message: outOfStockError.message,
              details: addData.data.cartLinesAdd.userErrors,
            },
            { status: 400 }
          )
        }

        return NextResponse.json(
          { error: addData.data.cartLinesAdd.userErrors[0].message },
          { status: 400 }
        )
      }

      const updatedCart = addData.data.cartLinesAdd.cart
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const updatedLines = updatedCart.lines.edges.map((edge: any) => ({
        id: edge.node.id,
        variantId: edge.node.merchandise.id,
        quantity: edge.node.quantity,
      }))

      return NextResponse.json(
        {
          cartId: updatedCart.id,
          checkoutUrl: updatedCart.checkoutUrl,
          lines: updatedLines,
          isNewCart: true,
        },
        {
          headers: {
            'Cache-Control': 'no-store',
          },
        }
      )
    }

    // Verificar se o carrinho existe
    const getCartQuery = {
      query: `
        query getCart($cartId: ID!) {
          cart(id: $cartId) {
            id
            checkoutUrl
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        cartId,
      },
    }

    const getCartResponse = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(getCartQuery),
      }
    )

    if (!getCartResponse.ok) {
      throw new Error(`Error getting cart: ${getCartResponse.statusText}`)
    }

    const getCartData = await getCartResponse.json()

    // Se o carrinho não existir, criar um novo
    if (!getCartData.data?.cart) {
      console.log('Cart not found, creating a new one')
      const createCartQuery = {
        query: `
          mutation cartCreate {
            cartCreate {
              cart {
                id
                checkoutUrl
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
      }

      const createCartResponse = await fetch(
        `https://${SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`,
        {
          method: 'POST',
          headers: {
            'X-Shopify-Storefront-Access-Token':
              SHOPIFY_STOREFRONT_ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(createCartQuery),
        }
      )

      if (!createCartResponse.ok) {
        throw new Error(`Error creating cart: ${createCartResponse.statusText}`)
      }

      const createCartData = await createCartResponse.json()

      if (createCartData.data?.cartCreate?.userErrors?.length > 0) {
        return NextResponse.json(
          { error: createCartData.data.cartCreate.userErrors[0].message },
          { status: 400 }
        )
      }

      // Retornar o novo ID do carrinho e URL de checkout
      return NextResponse.json({
        cartId: createCartData.data.cartCreate.cart.id,
        checkoutUrl: createCartData.data.cartCreate.cart.checkoutUrl,
        lines: [],
        isNewCart: true,
      })
    }

    // Mapear as linhas existentes no carrinho do Shopify
    const existingLines = getCartData.data.cart.lines.edges.map(
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      (edge: any) => ({
        id: edge.node.id,
        variantId: edge.node.merchandise.id,
        quantity: edge.node.quantity,
      })
    )

    // Determinar quais linhas precisam ser adicionadas, atualizadas ou removidas
    const linesToAdd = []
    const linesToUpdate = []
    const linesToRemove = []

    // Identificar linhas para adicionar ou atualizar
    for (const item of items) {
      const existingLine = existingLines.find(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (line: any) => line.variantId === item.variantId
      )

      if (existingLine) {
        // Se a quantidade for diferente, atualizar
        if (existingLine.quantity !== item.quantity) {
          linesToUpdate.push({
            id: existingLine.id,
            quantity: item.quantity,
          })
        }
      } else {
        // Se não existir, adicionar
        linesToAdd.push({
          merchandiseId: item.variantId,
          quantity: item.quantity,
        })
      }
    }

    // Identificar linhas para remover (existem no Shopify mas não no carrinho local)
    for (const line of existingLines) {
      const itemExists = items.some(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (item: any) => item.variantId === line.variantId
      )
      if (!itemExists) {
        linesToRemove.push(line.id)
      }
    }

    // Executar as operações necessárias
    let updatedCart = getCartData.data.cart

    // 1. Remover linhas
    if (linesToRemove.length > 0) {
      const removeQuery = {
        query: `
          mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
            cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
              cart {
                id
                checkoutUrl
                lines(first: 100) {
                  edges {
                    node {
                      id
                      quantity
                      merchandise {
                        ... on ProductVariant {
                          id
                        }
                      }
                    }
                  }
                }
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          cartId,
          lineIds: linesToRemove,
        },
      }

      const removeResponse = await fetch(
        `https://${SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`,
        {
          method: 'POST',
          headers: {
            'X-Shopify-Storefront-Access-Token':
              SHOPIFY_STOREFRONT_ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(removeQuery),
        }
      )

      if (!removeResponse.ok) {
        throw new Error(`Error removing lines: ${removeResponse.statusText}`)
      }

      const removeData = await removeResponse.json()

      if (removeData.data?.cartLinesRemove?.userErrors?.length > 0) {
        return NextResponse.json(
          { error: removeData.data.cartLinesRemove.userErrors[0].message },
          { status: 400 }
        )
      }

      updatedCart = removeData.data.cartLinesRemove.cart
    }

    // 2. Atualizar linhas
    if (linesToUpdate.length > 0) {
      const updateQuery = {
        query: `
          mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
            cartLinesUpdate(cartId: $cartId, lines: $lines) {
              cart {
                id
                checkoutUrl
                lines(first: 100) {
                  edges {
                    node {
                      id
                      quantity
                      merchandise {
                        ... on ProductVariant {
                          id
                        }
                      }
                    }
                  }
                }
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          cartId,
          lines: linesToUpdate,
        },
      }

      const updateResponse = await fetch(
        `https://${SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`,
        {
          method: 'POST',
          headers: {
            'X-Shopify-Storefront-Access-Token':
              SHOPIFY_STOREFRONT_ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateQuery),
        }
      )

      if (!updateResponse.ok) {
        throw new Error(`Error updating lines: ${updateResponse.statusText}`)
      }

      const updateData = await updateResponse.json()

      if (updateData.data?.cartLinesUpdate?.userErrors?.length > 0) {
        return NextResponse.json(
          { error: updateData.data.cartLinesUpdate.userErrors[0].message },
          { status: 400 }
        )
      }

      updatedCart = updateData.data.cartLinesUpdate.cart
    }

    // 3. Adicionar linhas
    if (linesToAdd.length > 0) {
      const addQuery = {
        query: `
          mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
            cartLinesAdd(cartId: $cartId, lines: $lines) {
              cart {
                id
                checkoutUrl
                lines(first: 100) {
                  edges {
                    node {
                      id
                      quantity
                      merchandise {
                        ... on ProductVariant {
                          id
                        }
                      }
                    }
                  }
                }
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        variables: {
          cartId,
          lines: linesToAdd,
        },
      }

      const addResponse = await fetch(
        `https://${SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`,
        {
          method: 'POST',
          headers: {
            'X-Shopify-Storefront-Access-Token':
              SHOPIFY_STOREFRONT_ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(addQuery),
        }
      )

      if (!addResponse.ok) {
        throw new Error(`Error adding lines: ${addResponse.statusText}`)
      }

      const addData = await addResponse.json()

      if (addData.data?.cartLinesAdd?.userErrors?.length > 0) {
        const outOfStockError = addData.data.cartLinesAdd.userErrors.find(
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          (error: any) =>
            error.message.includes('esgotou') ||
            error.message.includes('out of stock')
        )

        if (outOfStockError) {
          return NextResponse.json(
            {
              error: 'product_out_of_stock',
              message: outOfStockError.message,
              details: addData.data.cartLinesAdd.userErrors,
            },
            { status: 400 }
          )
        }

        return NextResponse.json(
          { error: addData.data.cartLinesAdd.userErrors[0].message },
          { status: 400 }
        )
      }

      updatedCart = addData.data.cartLinesAdd.cart
    }

    // Mapear as linhas atualizadas para retornar ao cliente
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const updatedLines = updatedCart.lines.edges.map((edge: any) => ({
      id: edge.node.id,
      variantId: edge.node.merchandise.id,
      quantity: edge.node.quantity,
    }))

    return NextResponse.json(
      {
        cartId: updatedCart.id,
        checkoutUrl: updatedCart.checkoutUrl,
        lines: updatedLines,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (error) {
    console.error('Error syncing cart:', error)
    return NextResponse.json({ error: 'Failed to sync cart' }, { status: 500 })
  }
}
