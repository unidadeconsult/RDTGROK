import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B00FF]/50 focus:ring-offset-2 focus:ring-offset-[#0A0D14]',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-[#8B00FF] to-[#00F0FF] text-white',
        secondary:
          'bg-[#1E293B] text-[#94A3B8] border border-[#1E293B]',
        outline:
          'border border-[#1E293B] text-[#94A3B8] bg-transparent',
        titular:
          'bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-[#0A0D14] font-bold',
        verde:
          'bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30',
        amarelo:
          'bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30',
        vermelho:
          'bg-[#FF3B5C]/15 text-[#FF3B5C] border border-[#FF3B5C]/30',
        azul:
          'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30',
        // Content status variants
        ideia:
          'bg-[#8B00FF]/15 text-[#8B00FF] border border-[#8B00FF]/30',
        desenvolvimento:
          'bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30',
        'pronto-criar':
          'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30',
        criando:
          'bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30',
        revisao:
          'bg-[#FF3B5C]/15 text-[#FF3B5C] border border-[#FF3B5C]/30',
        pronto:
          'bg-[#00FF87]/15 text-[#00FF87] border border-[#00FF87]/30',
        planejado:
          'bg-[#94A3B8]/15 text-[#94A3B8] border border-[#94A3B8]/30',
        publicado:
          'bg-[#00FF87]/20 text-[#00FF87] border border-[#00FF87]/40 font-bold',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
