'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

function getBarColor(value: number): string {
  if (value <= 25) return 'bg-[#FF3B5C]'
  if (value <= 50) return 'bg-[#FFD700]'
  if (value <= 75) return 'bg-[#00FF87]'
  return 'bg-[#00F0FF]'
}

function getTextColor(value: number): string {
  if (value <= 25) return 'text-[#FF3B5C]'
  if (value <= 50) return 'text-[#FFD700]'
  if (value <= 75) return 'text-[#00FF87]'
  return 'text-[#00F0FF]'
}

export interface AttributeBarProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: number
  maxValue?: number
  showValue?: boolean
}

const AttributeBar = React.forwardRef<HTMLDivElement, AttributeBarProps>(
  ({ className, label, value, maxValue = 100, showValue = true, ...props }, ref) => {
    const percent = Math.min(100, Math.max(0, (value / maxValue) * 100))
    const barColor = getBarColor(value)
    const textColor = getTextColor(value)

    return (
      <div ref={ref} className={cn('flex items-center gap-3', className)} {...props}>
        <span className="text-xs text-[#94A3B8] w-24 truncate uppercase tracking-wider">
          {label}
        </span>
        <div className="flex-1 h-2.5 bg-[#0A0D14] rounded-sm overflow-hidden border border-[#1E293B]/50">
          <div
            className={cn('h-full rounded-sm transition-all duration-500 ease-out', barColor)}
            style={{ width: `${percent}%` }}
          />
        </div>
        {showValue && (
          <span
            className={cn(
              'w-8 text-right text-sm font-bold tabular-nums font-mono',
              textColor
            )}
          >
            {value}
          </span>
        )}
      </div>
    )
  }
)
AttributeBar.displayName = 'AttributeBar'

export interface OverallBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
}

const OverallBadge = React.forwardRef<HTMLDivElement, OverallBadgeProps>(
  ({ className, value, ...props }, ref) => {
    const textColor = getTextColor(value)
    const borderColor =
      value <= 25
        ? 'border-[#FF3B5C]/40'
        : value <= 50
          ? 'border-[#FFD700]/40'
          : value <= 75
            ? 'border-[#00FF87]/40'
            : 'border-[#00F0FF]/40'

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center w-12 h-12 rounded-lg border-2 bg-[#0A0D14]',
          borderColor,
          className
        )}
        {...props}
      >
        <span className={cn('text-xl font-black tabular-nums font-mono', textColor)}>
          {value}
        </span>
      </div>
    )
  }
)
OverallBadge.displayName = 'OverallBadge'

export { AttributeBar, OverallBadge, getBarColor, getTextColor }
