import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}
