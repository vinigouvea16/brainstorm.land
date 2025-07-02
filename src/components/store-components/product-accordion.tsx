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

function extractSectionsFromHTML(html: string): Section[] {
  const container = document.createElement('div')
  container.innerHTML = html

  const sections: Section[] = []

  let currentTitle = ''
  let currentContent = ''

  Array.from(container.children).forEach((el, i, arr) => {
    if (el.tagName === 'H3') {
      // Save previous section
      if (currentTitle && currentContent) {
        sections.push({
          title: currentTitle,
          content: currentContent,
        })
      }

      currentTitle = el.textContent || ''
      currentContent = ''
    } else if (currentTitle) {
      currentContent += el.outerHTML
    }
  })

  // Add last section
  if (currentTitle && currentContent) {
    sections.push({
      title: currentTitle,
      content: currentContent,
    })
  }

  return sections
}

type Props = {
  html: string
}

export function ProductAccordion({ html }: Props) {
  if (typeof window === 'undefined') return null // SSR safeguard

  const sections = extractSectionsFromHTML(html)

  if (sections.length === 0) return null

  return (
    <Accordion type="single" collapsible className="mt-8 [&_h3]:text-red-400 ">
      {sections.map((section, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-xl">
            {section.title}
          </AccordionTrigger>
          <AccordionContent className="[&_ul]:pl-5 [&_li]:mb-2 [&_li]:text-base">
            {parse(section.content)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
