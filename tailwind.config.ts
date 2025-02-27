import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'brain-border': '#fff6',
        'brain-text': '#D8D0C3',
        'brain-hover': '#F05C4E',
        'brain-green': '#677444',
        'brain-span': '#A6D7AB',
      },
      fontFamily: {
        bergenregular: ['var(--font-bergen-regular)', 'sans-serif'],
        bergensemi: ['var(--font-bergen-semibold)', 'monospace'],
        windsor: ['var(--font-windsor-pro)', 'sans-serif'],
        albra: ['var(--font-albra)', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
