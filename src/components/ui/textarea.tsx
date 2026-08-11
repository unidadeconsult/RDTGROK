import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-lg border border-[#1E293B] bg-[#0A0D14] px-3 py-2 text-sm text-[#E2E8F0] placeholder:text-[#475569]',
          'transition-colors duration-200',
          'focus:outline-none focus:border-[#8B00FF]/50 focus:ring-2 focus:ring-[#8B00FF]/20',
          'hover:border-[#8B00FF]/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'resize-y',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
