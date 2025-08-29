import { ButtonVariant, ButtonSize } from '../types'

export const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 border-transparent',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 border-transparent',
  outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50',
  danger: 'bg-red-600 text-white hover:bg-red-700 border-transparent',
  success: 'bg-green-600 text-white hover:bg-green-700 border-transparent',
}

export const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

export const BUTTON_BASE_STYLES =
  'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'