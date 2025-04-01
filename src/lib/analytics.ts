export type GA4Item = {
  item_id: string
  item_name: string
  item_variant?: string
  price: number
  quantity?: number
  currency?: string
  item_category?: string
  item_brand?: string
  discount?: number
  coupon?: string
  affiliation?: string
  item_list_name?: string
  item_list_id?: string
  index?: number
}

export function trackViewProduct(product: GA4Item) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'view_item', {
    currency: product.currency || 'BRL',
    value: product.price,
    items: [product],
  })

  console.log('GA4: Produto visualizado', product.item_name)
}

export function trackAddToCart(product: GA4Item) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'add_to_cart', {
    currency: product.currency || 'BRL',
    value: product.price * (product.quantity || 1),
    items: [product],
  })

  console.log('GA4: Produto adicionado ao carrinho', product.item_name)
}

export function trackBeginCheckout(items: GA4Item[]) {
  if (typeof window === 'undefined' || !window.gtag) return

  const value = items.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  )

  window.gtag('event', 'begin_checkout', {
    currency: 'BRL',
    value,
    items,
  })

  console.log('GA4: Checkout iniciado', items.length)
}

export function trackPurchase(
  transactionId: string,
  items: GA4Item[],
  value: number,
  shipping = 0,
  tax = 0
) {
  if (typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    value,
    currency: 'BRL',
    tax,
    shipping,
    items,
  })

  console.log('GA4: Compra realizada', transactionId)
}
