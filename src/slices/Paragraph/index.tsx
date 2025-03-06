import type { FC } from 'react'
import type { Content } from '@prismicio/client'
import type { SliceComponentProps } from '@prismicio/react'

/**
 * Props for `Paragraph`.
 */
export type ParagraphProps = SliceComponentProps<Content.ParagraphSlice>

/**
 * Component for "Paragraph" Slices.
 */
const Paragraph: FC<ParagraphProps> = ({ slice }) => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      Placeholder component for paragraph (variation: {slice.variation}) Slices
    </section>
  )
}

export default Paragraph
