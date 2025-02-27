import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center transition-all focus:outline-none font-bergensemi uppercase',
  {
    variants: {
      variant: {
        default:
          'text-brain-text hover:bg-brain-hover transition-all tracking-wider duration-400 ease-in border-brain-border border rounded-full',
        arrow:
          'text-brain-text hover:bg-brain-hover hover:scale-110 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border-brain-border border rounded-full',
        icon: 'text-brain-text hover:scale-90 transition-all duration-400 ease-in border-brain-text border rounded-full bg-brain-text',
      },
      size: {
        sm: 'p-3',
        md: 'px-5 py-4',
        lg: 'px-5 py-[10px] text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'lg',
    },
  }
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  className?: string
}

export default function Button({
  children,
  variant,
  size,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  )
}
