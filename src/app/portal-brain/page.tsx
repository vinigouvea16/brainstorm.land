import Footer from '@/components/landing-page/footer'
import BlogCard from '@/components/ui/blog-card'
import Image from 'next/image'
import React from 'react'

export default function Blog() {
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
        className="2xl:max-w-[1440px] lg:max-w-[1280px] mx-auto my-40 flex items-start px-4 lg:px-0"
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
      <div className="2xl:max-w-[1440px] lg:max-w-[1280px] lg:grid lg:grid-cols-3 flex flex-col mx-auto gap-6 lg:px-0 px-4">
        <BlogCard backgroundImage="/cardlandingpage.jpeg">
          Cordyceps Sinensis: O Aliado Natural para Energia, Imunidade e Libido
        </BlogCard>

        {/* card 2 */}
        <BlogCard backgroundImage="/card2landingpage.png">
          A Rede Neuroquímica da Natureza tem Muito a nos Ensinar
        </BlogCard>

        {/* card 3 */}
        <BlogCard backgroundImage="/blogimage3.png">
          Set e o Setting para uma Jornada Psicodélica: Explorando os
          Fundamentos da Experiência
        </BlogCard>

        {/* card 4 */}
        <BlogCard backgroundImage="/blogimage4.jpeg">
          Juba de Leão: O Jardineiro do Cérebro
        </BlogCard>
      </div>

      <Footer />
    </main>
  )
}
