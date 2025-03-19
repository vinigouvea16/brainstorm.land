'use client'
import Footer from '@/components/landing-page/footer'
import ProductCard from '@/components/ui/product-card'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import sanitizeHtml from 'sanitize-html'

type Product = {
  id: string
  title: string
  description: string
  handle: string
  imageUrl: string
  price: string
  tags: string
  productLink: string
}

const tabs: string[] = ['para vestir', 'para nutrir', 'para elevar']

export default function Produtos() {
  const [products, setProducts] = useState<Product[]>([])
  const [activeTab, setActiveTab] = useState<string>(tabs[1])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/shopify/products')
        if (!res.ok) throw new Error('Erro ao buscar produtos')

        const data = await res.json()
        // console.log('Dados dos produtos do Shopify:', data)

        if (!Array.isArray(data)) {
          console.error('Erro: estrutura inesperada da resposta da API', data)
          return
        }

        const formattedProducts = data.map(product => {
          const cleanDescription = sanitizeHtml(product.description || '', {
            allowedTags: [],
            allowedAttributes: {},
          })
          return {
            id: product.id,
            title: product.title,
            description: `${cleanDescription.substring(0, 365)}...`,
            imageUrl: product.imageUrl || '',
            price: product.price || '00.00',
            tags: product.tags || '',
            handle: product.handle,
            productLink: `/produtos/${product.handle}`,
          }
        })

        // console.log('Produtos formatados:', formattedProducts)
        setProducts(formattedProducts)
      } catch (error) {
        console.error('Erro ao buscar produtos do Shopify:', error)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter(
    product => product.tags === activeTab
  )

  return (
    <main>
      <div className="relative xl:h-[80vh] h-[60vh]">
        <Image
          src="/productpageheroimg2.jpg"
          alt="products page hero img"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
        <div className="absolute inset-x-0 bottom-10">
          <div className="2xl:max-w-[1440px] lg:max-w-[1280px] mx-auto">
            <h1 className="uppercase font-windsor xl:text-8xl md:text-7xl text-4xl xl:text-left px-4 xl:px-0 tracking-tighter">
              conheça nossa linha de produtos
            </h1>
          </div>
        </div>
      </div>

      <div className="2xl:max-w-[1440px] lg:max-w-[1280px] lg:px-0 px-4 mx-auto my-40 flex items-start">
        <motion.p
          initial={{ opacity: 0, translateY: '100%' }}
          whileInView={{ opacity: 1, translateY: 0 }}
          transition={{ duration: 0.3, ease: 'easeIn', delay: 0.3 }}
          viewport={{ once: true, amount: 0.4 }}
          className="font-bergenregular text-lg max-w-[640px] uppercase opacity-80"
        >
          Um pacote completo de produtos brainstorm
        </motion.p>
      </div>

      {/* store section com abas */}
      <div
        className="2xl:max-w-[1440px] lg:max-w-[1280px] lg:px-0 px-4 w-full mx-auto flex flex-col"
        id="hero"
      >
        {/* tab navigation */}
        <div
          className="flex lg:gap-12 font-windsor text-2xl lg:justify-between justify-between"
          id="tab"
        >
          {tabs.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-b border-brain-border lg:w-1/3 lg:pb-4 pb-2 first-letter:uppercase ${
                activeTab === tab ? 'text-brain-green' : 'text-brain-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} {...product} />
            ))
          ) : activeTab === 'para elevar' ? (
            <p className="text-brain-green text-xl mt-10 font-windsor">
              Desbravando a rota. Chegando ao mundo em breve...
            </p>
          ) : null}
        </div>
      </div>

      <Footer />
    </main>
  )
}
