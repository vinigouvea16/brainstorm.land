'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { BookOpen, Shield, Clock, AlertTriangle } from 'lucide-react'
import Button from '../ui/button'
import type { StructuredData } from '../../types/structured-data'

interface SmartProductDescriptionProps {
  product: {
    id: string
    title: string
    description: string
    tags?: string[]
    metafields?: Array<{
      namespace: string
      key: string
      value: string
    }>
  }
  isParaNutrir: boolean
}

export default function SmartProductDescription({
  product,
}: SmartProductDescriptionProps) {
  const [structuredData, setStructuredData] = useState<StructuredData | null>(
    null
  )

  useEffect(() => {
    const structuredField = product.metafields?.find(
      field => field && field.namespace === 'structured' && field.key === 'data'
    )

    if (structuredField?.value) {
      try {
        const parsed = JSON.parse(structuredField.value)
        setStructuredData(parsed)
      } catch (error) {
        console.error(
          'Erro ao fazer parse dos dados estruturados:',
          error instanceof Error ? error.message : 'Erro desconhecido'
        )
      }
    }
  }, [product.metafields])

  if (structuredData) {
    return <EnhancedProductInfo product={product} data={structuredData} />
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.4 } },
      }}
      className=""
    >
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            translateY: 0,
            transition: { duration: 0.5, ease: 'easeIn', delay: 1 },
          },
        }}
        className="prose-sm prose-gray pt-4 prose pr-2 max-w-none
                   [&>p]:mb-3 [&>p]:text-sm lg:[&>p]:text-lg [&>p]:text-brain-text [&_p]:leading-relaxed
                   [&_strong]:font-semibold [&_strong]:text-brain-span
                   [&_ul]:pl-6 [&_ul]:mb-2 [&_li]:mb-1 [&_li]:text-sm lg:[&_li]:text-base [&_li]:text-brain-text/80
                   [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: product.description }}
      />
    </motion.div>
  )
}

function EnhancedProductInfo({
  product,
  data,
}: {
  product: SmartProductDescriptionProps['product']
  data: StructuredData
}) {
  // Agrupamento dinâmico de estudos por categoria
  const studiesByCategory = useMemo(() => {
    const categories: Record<string, typeof data.studies> = {}

    // biome-ignore lint/complexity/noForEach: <explanation>
    data.studies.forEach(study => {
      if (!categories[study.category]) {
        categories[study.category] = []
      }
      categories[study.category].push(study)
    })

    return categories
  }, [data.studies])

  // Obter categorias disponíveis dinamicamente
  const availableCategories = Object.keys(studiesByCategory)

  // Timeline entries dinâmicas
  const timelineEntries = Object.entries(data.timeline)

  // Função para traduzir categorias para português
  const translateCategory = (category: string) => {
    const translations: Record<string, string> = {
      immune: 'Imunológico',
      emotional: 'Emocional',
      physical: 'Físico',
      cognitive: 'Cognitivo',
    }
    return (
      translations[category] ||
      category.charAt(0).toUpperCase() + category.slice(1)
    )
  }

  const translateTimelineKey = (key: string) => {
    const translations: Record<string, string> = {
      immune: 'Imunidade',
      emotional: 'Emocional',
      physical: 'Físico',
      cognitive: 'Cognitivo',
      longTerm: 'Longo Prazo',
    }
    return translations[key] || key.charAt(0).toUpperCase() + key.slice(1)
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.4 } },
      }}
      className="pt-4 space-y-6"
    >
      {/* Badges dos Benefícios */}
      <motion.div
        variants={{
          hidden: { opacity: 0, translateY: '20%' },
          visible: {
            opacity: 1,
            translateY: 0,
            transition: { duration: 0.5, ease: 'easeIn' },
          },
        }}
      >
        <Card className="bg-transparent text-white border-brain-text">
          <CardHeader>
            <CardTitle className="text-lg">Principais Benefícios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {data.badges.map((badge, index) => (
                <Badge
                  key={`${product.id}-badge-${badge.title}-${index}`}
                  variant="default"
                  className="justify-start p-3 text-sm bg-brain-green/25"
                >
                  {badge.emoji} {badge.title}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Timeline Dinâmica */}
      {timelineEntries.length > 0 && (
        <motion.div
          variants={{
            hidden: { opacity: 0, translateY: '20%' },
            visible: {
              opacity: 1,
              translateY: 0,
              transition: { duration: 0.5, ease: 'easeIn', delay: 0.2 },
            },
          }}
        >
          <Card className="bg-brain-span/10 text-white border-brain-span">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-brain-hover" />
                Quando Esperar Resultados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {timelineEntries.map(([category, description]) => (
                <div key={category} className="text-sm">
                  <strong>{translateTimelineKey(category)}:</strong>{' '}
                  {description}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Composição Rápida */}
      <motion.div
        variants={{
          hidden: { opacity: 0, translateY: '20%' },
          visible: {
            opacity: 1,
            translateY: 0,
            transition: { duration: 0.5, ease: 'easeIn', delay: 0.4 },
          },
        }}
      >
        <Card className="bg-transparent text-brain-text border-brain-border">
          <CardHeader>
            <CardTitle className="text-xl text-brain-span">
              Especificações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <strong>Composição:</strong> {data.composition.ingredients}
              </div>
              <div>
                <strong>Quantidade:</strong> {data.composition.quantity}
              </div>
              <div>
                <strong>Digestão:</strong> {data.composition.digestion}
              </div>
              <div>
                <strong>Protocolo:</strong> {data.composition.protocol}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Botão para Drawer com Estudos */}
      <motion.div
        variants={{
          hidden: { opacity: 0, translateY: '20%' },
          visible: {
            opacity: 1,
            translateY: 0,
            transition: { duration: 0.5, ease: 'easeIn', delay: 0.6 },
          },
        }}
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="w-full bg-transparent text-sm lg:text-base hover:bg-brain-green"
            >
              <BookOpen className="w-5 h-5 mr-2 text-brain-span" />
              Ver {data.studies.length} Estudos Científicos Completos
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-3xl overflow-y-auto bg-[#22271C]">
            <SheetHeader>
              <SheetTitle className="text-brain-text">
                Estudos Científicos - {product.title}
              </SheetTitle>
              <SheetDescription className="underline underline-offset-2 text-brain-span">
                {data.studies.length} estudos organizados por categoria
              </SheetDescription>
            </SheetHeader>

            {/* Tabs Dinâmicas baseadas nas categorias disponíveis */}
            <Tabs
              defaultValue={availableCategories[0]}
              className="mt-6 bg-transparent"
            >
              <TabsList
                className="grid w-full bg-brain-border"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(availableCategories.length, 4)}, 1fr)`,
                }}
              >
                {availableCategories.slice(0, 4).map(category => (
                  <TabsTrigger key={category} value={category} className="">
                    {translateCategory(category)} (
                    {studiesByCategory[category].length})
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(studiesByCategory).map(([category, studies]) => (
                <TabsContent key={category} value={category} className="mt-4">
                  <div className="space-y-4">
                    {studies.map((study, index) => (
                      <Card
                        key={`${product.id}-study-${category}-${study.title}-${index}`}
                        className="bg-[#22271C] text-brain-text border-brain-span"
                      >
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {study.title}
                            {study.duration && (
                              <Badge
                                variant="outline"
                                className="text-xs lg:text-sm text-white tracking-wide"
                              >
                                {study.duration}
                              </Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm mb-3">{study.description}</p>
                          {study.reference && (
                            <p className="text-sm text-blue-400">
                              🔗 <b>Referência:</b> {study.reference}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* FAQ no Drawer */}
            <div className="mt-8">
              <h3 className="text-xl text-center text-brain-span font-bold mb-4">
                FAQ
              </h3>
              <Accordion type="single" collapsible className="px-1">
                {data.faq.map((item, index) => (
                  <AccordionItem
                    key={`${product.id}-faq-${index}`}
                    value={`faq-${index}`}
                  >
                    <AccordionTrigger className="text-left lg:text-lg text-brain-text">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Informações de Segurança Melhoradas */}
            <Card className="mt-6 bg-white/75 border-brain-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brain-hover" />
                  Informações de Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong className="text-sm">Efeitos Colaterais:</strong>
                  <p className="text-sm">{data.safety.sideEffects}</p>
                  {data.safety.sideEffectsAdvice && (
                    <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800">
                          {data.safety.sideEffectsAdvice}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <strong className="text-sm">Contraindicações:</strong>
                  <ul className="text-sm list-disc list-inside">
                    {data.safety.contraindications.map((item, index) => (
                      <li key={`${product.id}-contraindication-${index}`}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </SheetContent>
        </Sheet>
      </motion.div>

      {/* Certificações */}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: 0.5, ease: 'easeIn', delay: 0.8 },
          },
        }}
        className="grid grid-cols-2 gap-4 xl:grid-cols-4 xl:gap-6 text-brain-span py-4 border-t"
      >
        {data.safety.certifications.map((cert, index) => (
          <div
            key={`${product.id}-cert-${cert}-${index}`}
            className="flex items-center justify-center gap-1"
          >
            <Shield className="w-4 h-4" />
            <span>{cert}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
