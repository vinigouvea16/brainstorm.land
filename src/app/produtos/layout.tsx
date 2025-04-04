import '../globals.css'
import type { Metadata } from 'next'

export default function LayoutProdutos({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}

export const metadata: Metadata = {
  title: 'Produtos | Brainstorm',
  description:
    'Desvende a magia dos produtos Brain CO. e permita que eles elevem sua vida a um novo patamar de consciência e bem-estar. Explore nossas submarcas, abrace a jornada de autoconhecimento e seja parte de uma comunidade vibrante em busca da expansão da mente. Seu despertar começa agora!',
}
