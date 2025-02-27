'use client'
import Footer from '@/components/landing-page/footer'
import ProductCard from '@/components/ui/product-card'
import Image from 'next/image'
import React, { useState } from 'react'
import { motion } from 'motion/react'

const productData = [
  {
    imageUrl: '/jubadeleao.jpeg',
    title: 'Juba de Leão - Hericium Erinaceus - 60 cápsulas',
    price: '99,00',
    description:
      'Inspirado pelo legado dos sábios, validado pela ciência. O Hericium Erinaceus é um tesouro da medicina tradicional chinesa, venerado nos antigos mosteiros budistas nas montanhas da China e do Japão. O Juba de Leão é um aliado natural para memória, foco, cognição e regeneração neural, trazendo equilibrio e clareza para sua mente.',
    productLink: '',
    tag: 'Para nutrir',
  },
  {
    imageUrl: '/cordyceps.jpeg',
    title: 'Cordyceps - Ophiocordyceps Sinensis - 60 cápsulas',
    price: '99,00',
    description:
      'Inspirado pela vitalidade da natureza, validade pela ciência. O Cordyceps Sinensis, um fenômeno da medicina tibetana, é conhecido como o “cogumelo da performance”. Tradicionalmente utilizado desde monges até atletas para aumentar energia e resistência. O Cordyceps é um aliado poderoso de quem busca melhorar performance física e vitalidade – incluindo a libido.',
    productLink: '',
    tag: 'Para nutrir',
  },
  {
    imageUrl: '/jubadeleao.jpeg',
    title: 'Reishi - Gonoderma Lucidum - 60 cápsulas',
    price: '99,00',
    description:
      'Inspirado pela tradição, validade pela ciência. O Ganoderma lucidum é a herança medicinal da Dinastia Ming. Conhecido com cogumelo do Imperador, ele é um pilar da medicina tradicional chinesa, com função anti-inflamatória, anticoagulante e antitumoral. Um modelador de sistema, reverenciado por séculos por suas propriedades curativas e de longevidade, trazendo equilíbrio e bem-estar para nutrir sua vida.',
    productLink: '',
    tag: 'Para nutrir',
  },
  {
    imageUrl: '/jubadeleao.jpeg',
    title: 'Produto Vestir',
    price: '120,00',
    description: 'Descrição do produto para vestir...',
    productLink: '',
    tag: 'Para vestir',
  },
  {
    imageUrl: '/jubadeleao.jpeg',
    title: 'Produto Elevar',
    price: '150,00',
    description: 'Descrição do produto para elevar...',
    productLink: '',
    tag: 'Para elevar',
  },
  // ...adicionar mais produtos
]

const tabs = ['Para vestir', 'Para nutrir', 'Para elevar']

export default function Produtos() {
  const [activeTab, setActiveTab] = useState(tabs[0])

  const filteredProducts = productData.filter(
    product => product.tag === activeTab
  )

  return (
    <main>
      <div className="relative xl:h-[80vh] h-[60vh]" id="hero">
        <Image
          src="/productpageheroimg2.jpg"
          alt="products page hero img"
          fill
          className="object-cover"
          unoptimized
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
      <div className="2xl:max-w-[1440px] lg:max-w-[1280px] lg:px-0 px-4 w-full mx-auto flex flex-col">
        {/* tab navigation */}
        <div
          className="flex lg:gap-12 font-windsor text-2xl lg:justify-between justify-between"
          id="tab"
        >
          {tabs.map(tab => (
            // biome-ignore lint/a11y/useButtonType: <explanation>
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b border-brain-border lg:w-1/3 lg:pb-4 pb-2 ${
                activeTab === tab ? 'text-brain-green' : 'text-brain-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* map products */}
        <div className="mt-10">
          {filteredProducts.map((product, index) => (
            <ProductCard
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              imageUrl={product.imageUrl}
              title={product.title}
              price={product.price}
              description={product.description}
              productLink={product.productLink}
              tag={product.tag}
            />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  )
}
