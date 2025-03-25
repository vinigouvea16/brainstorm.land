import React from 'react'
import Button from '../ui/button'
import BlogCard from '../ui/blog-card'
import Link from 'next/link'
import ParallaxHeader from '../animations/parallax-effect/motion'
import { asImageSrc } from '@prismicio/helpers'
import { createClient } from '@/prismicio'
import { PrismicRichText } from '@prismicio/react'

export default async function BlogSection() {
  const client = createClient()

  const posts = await client.getAllByType('blogpost', {
    orderings: {
      field: 'document.first_publication_date',
      direction: 'asc',
    },
  })

  const relatedPosts = posts.slice(0, 2)

  return (
    <div className="2xl:max-w-[1560px] lg:max-w-[1280px] mx-auto w-full flex flex-col lg:py-32 lg:pb-16 pt-20 overflow-hidden px-4">
      {/* PARALLAX */}
      <div className="relative flex flex-col max-w-[1440px] items-center uppercase h-52">
        <ParallaxHeader
          title1="informação"
          title2="aos buscadores"
          parallaxValues={{ x1: [-550, 400], x2: [350, -200] }}
        />
      </div>

      <div className="flex lg:flex-row flex-col justify-center space-y-8 md:space-y-0 gap-4 mb-24 mx-auto ">
        {relatedPosts.map((post, index) => {
          const cardImage = post.data.postcardimage
            ? (asImageSrc(post.data.postcardimage) as string)
            : '/card2landingpage.png'

          return (
            <BlogCard
              key={post.uid}
              backgroundImage={cardImage}
              href={`/portal-brain/${post.uid}`}
              className={index === 0 ? 'mt-12' : ''}
            >
              <PrismicRichText field={post.data.heroh1} />
            </BlogCard>
          )
        })}
      </div>

      <div className="flex justify-center items-start lg:mb-32 mb-16">
        <Link href="/portal-brain">
          <Button>ver blog</Button>
        </Link>
      </div>

      <div className="text-left max-w-[660px]">
        <p className="font-bergenregular lg:text-xl md:text-base uppercase text-brain-text">
          O equilíbrio físico, mental e espiritual impulsiona a clareza de
          pensamento, foco e desempenho cognitivo. Não se engane: não estamos
          falando apenas de produtividade. Em um mundo hiperativo, precisamos
          entender quando é o momento de acalmar a mente, ter insights profundos
          e despertar para o Eu Interior. Somos do time do espírito curioso e da
          alma que busca.
        </p>
      </div>
    </div>
  )
}
