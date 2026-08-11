import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border border-[#1E293B] bg-[#0A0D14] px-3 py-2 text-sm text-[#E2E8F0] placeholder:text-[#475569]',
          'transition-colors duration-200',
          'focus:outline-none focus:border-[#8B00FF]/50 focus:ring-2 focus:ring-[#8B00FF]/20',
          'hover:border-[#8B00FF]/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#E2E8F0]',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
