'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import parse from 'html-react-parser'

type Section = {
  title: string
  content: string
}

function extractPartsFromHTML(html: string): {
  intro: string
  sections: Section[]
  outro: string
} {
  const container = document.createElement('div')
  container.innerHTML = html

  const children = Array.from(container.children)

  let intro = ''
  let outro = ''
  const sections: Section[] = []

  let currentTitle = ''
  let currentContent = ''
  let sectionStarted = false

  for (let i = 0; i < children.length; i++) {
    const el = children[i]
    const isHeading = ['H2', 'H3'].includes(el.tagName)

    if (!sectionStarted && !isHeading) {
      intro += el.outerHTML
      continue
    }

    if (isHeading) {
      if (currentTitle && currentContent) {
        sections.push({
          title: currentTitle,
          content: currentContent,
        })
      }

      currentTitle = el.textContent || ''
      currentContent = ''
      sectionStarted = true
      continue
    }

    const remainingElements = children.slice(i)
    const hasNextHeading = remainingElements.some(el =>
      ['H2', 'H3'].includes(el.tagName)
    )

    if (sectionStarted && hasNextHeading) {
      currentContent += el.outerHTML
    } else if (sectionStarted && !hasNextHeading) {
      outro += el.outerHTML
    }
  }

  if (currentTitle && currentContent) {
    sections.push({
      title: currentTitle,
      content: currentContent,
    })
  }

  return { intro, sections, outro }
}

type Props = {
  html: string
}

export function ProductAccordion({ html }: Props) {
  if (typeof window === 'undefined') return null

  const { intro, sections, outro } = extractPartsFromHTML(html)

  return (
    <div className="space-y-6 mt-4 ">
      {intro && (
        <div className="[&_p]:text-base [&_p]:mb-2 text-muted-foreground">
          {parse(intro)}
        </div>
      )}

      {sections.length > 0 && (
        <Accordion
          type="single"
          collapsible
          className="[&_ul]:pl-5 [&_li]:mb-2 scroll-mt-32"
        >
          {sections.map((section, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: conteúdo fixo e previsível
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-xl">
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="">
                {parse(section.content)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {outro && (
        <div className="[&_p]:text-base [&_p]:mt-4 text-muted-foreground">
          {parse(outro)}
        </div>
      )}
    </div>
  )
}
