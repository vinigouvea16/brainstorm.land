import Footer from '@/components/landing-page/footer'
import BlogCard from '@/components/ui/blog-card'
import Button from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/prismicio'
import { asImageSrc } from '@prismicio/helpers'
import { isFilled } from '@prismicio/client'
import ParallaxHeader from '@/components/animations/parallax-effect/motion'
import { PrismicRichText } from '@prismicio/react'

type Params = { uid: string }

export default async function PostPage({
  params,
}: { params: Promise<Params> }) {
  const { uid } = await params
  const client = createClient()
  const page = await client.getByUID('blogpost', uid).catch(() => notFound())

  const heroImageUrl = page.data.heroimage
    ? (asImageSrc(page.data.heroimage) as string)
    : undefined

  const allPosts = await client.getAllByType('blogpost', {
    orderings: {
      field: 'document.first_publication_date',
      direction: 'asc',
    },
  })

  const relatedPosts = allPosts.filter(post => post.uid !== uid).slice(0, 2)

  return (
    <main className="">
      <div className="relative xl:h-[60vh] h-[50vh]" id="hero">
        {heroImageUrl && (
          <Image
            src={heroImageUrl}
            alt="blog page hero img"
            fill
            priority
            quality={90}
            className="object-cover opacity-55"
          />
        )}
        <div className="absolute inset-x-0 bottom-0">
          <div className="2xl:max-w-[1440px] lg:max-w-[1280px] 2xl:px-12 xl:px-0 px-4 mx-auto">
            <div className="font-windsor text-brain-text md:text-8xl text-5xl mb-12 leading-none text-left tracking-tight">
              <PrismicRichText field={page.data.heroh1} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1080px] mx-auto lg:my-20 my-4 flex lg:px-0 px-4 prose">
        <div className="lg:text-lg space-y-4 text-base prose-headings:text-brain-text prose-p:text-brain-text/75 prose-strong:text-brain-text prose-a:text-brain-span/70 ">
          <PrismicRichText field={page.data.contentparagraph1} />
        </div>
      </div>

      <div className="2xl:max-w-[1440px] lg:max-w-[1280px] mx-auto w-full flex flex-col lg:py-32 lg:pb-16 pt-20 overflow-hidden px-4">
        <ParallaxHeader
          title1="posts"
          title2="relacionados"
          parallaxValues={{ x1: [-550, 300], x2: [300, -200] }}
        />

        <div className="flex lg:flex-row flex-col justify-center space-y-8 md:space-y-0 gap-4 mb-24 mx-auto ">
          {relatedPosts.map((post, index) => {
            const cardImage = post.data.postcardimage
              ? (asImageSrc(post.data.postcardimage) as string)
              : '/defaultCard.jpg'

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

        <div className="flex justify-center items-start mb-40">
          <Link href="/portal-brain">
            <Button>ver todos</Button>
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export async function generateStaticParams() {
  const client = createClient()
  const pages = await client.getAllByType('blogpost')
  return pages.map(page => ({ uid: page.uid }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { uid } = await params
  const client = createClient()
  const page = await client.getByUID('blogpost', uid).catch(() => notFound())

  return {
    title: `${page.data.meta_title} | Brain Co.`,
    description: page.data.meta_description,
    openGraph: {
      title: isFilled.keyText(page.data.meta_title)
        ? page.data.meta_title
        : undefined,
      description: isFilled.keyText(page.data.meta_description)
        ? page.data.meta_description
        : undefined,
      images: isFilled.image(page.data.meta_image)
        ? [asImageSrc(page.data.meta_image)]
        : undefined,
    },
  }
}
