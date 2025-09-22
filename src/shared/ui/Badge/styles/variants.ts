import { BadgeVariant, BadgeSize } from '../types'

export const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  primary: 'bg-blue-100 text-blue-800 border-blue-200',
  secondary: 'bg-gray-100 text-gray-800 border-gray-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  outline: 'bg-transparent text-gray-700 border-gray-300',
}

export const BADGE_SIZES: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

export const BADGE_BASE_STYLES =
  'inline-flex items-center font-medium border transition-colors'

export const BADGE_ROUNDED_STYLES = 'rounded-full'
export const BADGE_DEFAULT_ROUNDED_STYLES = 'rounded-md'

export const BADGE_INTERACTIVE_STYLES = 'cursor-pointer hover:opacity-80'