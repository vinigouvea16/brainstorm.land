export interface StructuredData {
  badges: Array<{
    title: string
    emoji: string
    description: string
  }>

  studies: Array<{
    title: string
    description: string
    reference?: string
    duration?: string
    category: string
  }>

  composition: {
    spectrum: string
    digestion: string
    ingredients: string
    quantity: string
    capsules: number
    protocol: string
  }

  usage?: {
    dosage: string
    timing: string
    attackDose?: {
      amount: string
      duration: string
      followUp: string
    }
  }

  safety: {
    sideEffects: string
    sideEffectsAdvice?: string
    contraindications: string[]
    certifications: string[]
  }

  timeline: Record<string, string>

  faq: Array<{
    question: string
    answer: string
    category?: string
  }>
}
