'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B00FF]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D14] disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-[#8B00FF] to-[#00F0FF] text-white shadow-lg shadow-[#8B00FF]/25 hover:shadow-[#8B00FF]/40 hover:brightness-110 active:brightness-95',
        secondary:
          'bg-[#141924] text-[#E2E8F0] border border-[#1E293B] hover:bg-[#1E293B] hover:border-[#8B00FF]/30',
        outline:
          'border border-[#1E293B] bg-transparent text-[#E2E8F0] hover:bg-[#141924] hover:border-[#8B00FF]/50',
        ghost:
          'bg-transparent text-[#E2E8F0] hover:bg-[#141924] hover:text-white',
        destructive:
          'bg-[#FF3B5C]/10 text-[#FF3B5C] border border-[#FF3B5C]/20 hover:bg-[#FF3B5C]/20 hover:border-[#FF3B5C]/40',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
