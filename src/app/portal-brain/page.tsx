import Footer from '@/components/landing-page/footer'
import BlogCard from '@/components/ui/blog-card'
import { createClient } from '@/prismicio'
import { asImageSrc } from '@prismicio/helpers'
import { PrismicRichText } from '@prismicio/react'
import Image from 'next/image'
import React from 'react'

export default async function Blog() {
  const client = createClient()

  const posts = await client.getAllByType('blogpost', {
    orderings: {
      field: 'document.first_publication_date',
      direction: 'desc',
    },
  })

  return (
    <main className="">
      <div className="relative xl:h-[80vh] h-[60vh]">
        <Image
          src="/blogpageimghero.jpg"
          alt="blog page hero img"
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-x-0 bottom-0">
          <div className="2xl:max-w-[1560px] lg:max-w-[1280px] 2xl:px-12 xl:px-0 px-4 mx-auto">
            <h1 className="uppercase font-windsor text-white/90 xl:text-[150px] md:text-8xl text-7xl mb-12 leading-none text-left tracking-tight">
              portal brain
            </h1>
          </div>
        </div>
      </div>

      <div
        className="2xl:max-w-[1560px] lg:max-w-[1280px] mx-auto my-40 flex items-start px-4 lg:px-0"
        id="hero"
      >
        <p className="font-bergenregular text-lg max-w-[640px] uppercase opacity-80">
          Bem-vindo ao blog da Brainstorm, um espaço dedicado ao despertar da
          mente e da alma. Nossos artigos e conteúdos são cuidadosamente criados
          para inspirar e guiar você em uma jornada de crescimento pessoal e
          transformação
        </p>
      </div>

      {/* grid cards */}
      <div className="2xl:max-w-[1560px] lg:max-w-[1280px] lg:grid lg:grid-cols-3 flex flex-col mx-auto gap-6 lg:px-0 px-4">
        {posts.map(post => {
          const cardImage = post.data.postcardimage
            ? (asImageSrc(post.data.postcardimage) as string)
            : '/card2landingpage.png' // fallback

          return (
            <BlogCard
              key={post.uid}
              backgroundImage={cardImage}
              href={`/portal-brain/${post.uid}`}
            >
              <PrismicRichText field={post.data.heroh1} />
            </BlogCard>
          )
        })}
      </div>

      <Footer />
    </main>
  )
}
