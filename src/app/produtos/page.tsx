'use client'
import Footer from '@/components/landing-page/footer'
import ProductCard from '@/components/ui/product-card'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import sanitizeHtml from 'sanitize-html'
import Header from '@/components/landing-page/header'
// import RegionSelector from '@/components/region/region-selector'
// import { useRegion } from '@/contexts/region-context'
import type { ProductCardProps } from '@/types/product'

const tabs: string[] = ['para vestir', 'para nutrir', 'para elevar']

export default function Produtos() {
  const [products, setProducts] = useState<ProductCardProps[]>([])
  const [activeTab, setActiveTab] = useState<string>(tabs[1])
  const [isLoading, setIsLoading] = useState(true)
  // const { region } = useRegion()

  // Efeito para buscar produtos quando a região mudar
  // useEffect(() => {
  //   async function fetchProducts() {
  //     setIsLoading(true)
  //     try {
  //       const res = await fetch(`/api/shopify/products?region=${region}`)
  //       if (!res.ok) throw new Error('Erro ao buscar produtos')

  //       const data = await res.json()

  //       if (!Array.isArray(data)) {
  //         console.error('Erro: estrutura inesperada da resposta da API', data)
  //         return
  //       }

  //       const formattedProducts = data.map(product => {
  //         const cleanDescription = sanitizeHtml(product.description || '', {
  //           allowedTags: [],
  //           allowedAttributes: {},
  //         })

  //         const primaryTag = Array.isArray(product.tags)
  //           ? product.tags[0] || ''
  //           : typeof product.tags === 'string'
  //             ? product.tags
  //             : ''

  //         return {
  //           id: product.id,
  //           title: product.title,
  //           description: `${cleanDescription.substring(0, 365)}...`,
  //           imageUrl: product.imageUrl || '',
  //           price: product.price || '00.00',
  //           tags: primaryTag,
  //           handle: product.handle,
  //           productLink: `/produtos/${product.handle}`,
  //           currency: product.currency || 'BRL',
  //         }
  //       })

  //       setProducts(formattedProducts)
  //     } catch (error) {
  //       console.error('Erro ao buscar produtos do Shopify:', error)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  //   fetchProducts()
  // }, [region])

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true)
      try {
        const res = await fetch('/api/shopify/products')
        if (!res.ok) throw new Error('Erro ao buscar produtos')

        const data = await res.json()

        if (!Array.isArray(data)) {
          console.error('Erro: estrutura inesperada da resposta da API', data)
          return
        }

        const formattedProducts = data.map(product => {
          const cleanDescription = sanitizeHtml(product.description || '', {
            allowedTags: [],
            allowedAttributes: {},
          })

          const primaryTag = Array.isArray(product.tags)
            ? product.tags[0] || ''
            : typeof product.tags === 'string'
              ? product.tags
              : ''

          return {
            id: product.id,
            title: product.title,
            description: `${cleanDescription.substring(0, 365)}...`,
            imageUrl: product.imageUrl || '',
            price: product.price || '00.00',
            tags: primaryTag,
            handle: product.handle,
            productLink: `/produtos/${product.handle}`,
            currency: product.currency || 'BRL',
          }
        })

        setProducts(formattedProducts)
      } catch (error) {
        console.error('Erro ao buscar produtos do Shopify:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter(
    product => product.tags === activeTab
  )

  return (
    <main>
      <Header />
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

      <motion.div
        initial={{ opacity: 0, translateY: '100%' }}
        whileInView={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.3, ease: 'easeIn', delay: 0.3 }}
        viewport={{ once: true, amount: 0.4 }}
        className="2xl:max-w-[1440px] lg:max-w-[1280px] 2xl:px-0 px-4 mx-auto lg:my-40 my-28 flex items-end justify-between gap-8"
      >
        <p className="font-bergenregular text-lg max-w-[640px] uppercase opacity-80">
          Um pacote completo de produtos brainstorm
        </p>

        {/* <div className="flex flex-col items-center">
          <span className="text-base text-stone-600">Região:</span>
          <RegionSelector />
        </div> */}
      </motion.div>

      {/* store section com abas */}
      <div
        className="2xl:max-w-[1440px] lg:max-w-[1280px] 2xl:px-0 px-4 w-full mx-auto flex flex-col"
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
          {isLoading ? (
            // Mostrar um estado de carregamento
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-brain-green border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-brain-text">Carregando produtos...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} {...product} />
            ))
          ) : activeTab === 'para elevar' ? (
            <p className="text-brain-green text-xl mt-10 font-windsor">
              Desbravando a rota. Chegando ao mundo em breve...
            </p>
          ) : (
            <p className="text-brain-green text-xl mt-10 font-windsor">
              Nenhum produto encontrado nesta categoria para a região
              selecionada.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
