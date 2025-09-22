import { InputVariant, InputSize } from '../types'

export const INPUT_VARIANTS: Record<InputVariant, string> = {
    primary: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    secondary: 'border-gray-200 focus:border-gray-400 focus:ring-gray-400',
    success: 'border-green-500 focus:border-green-600 focus:ring-green-600',
    error: 'border-red-500 focus:border-red-600 focus:ring-red-600',
    disabled: 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed',
}

export const INPUT_SIZES: Record<InputSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
}

export const INPUT_ICON_POSITIONS: Record<InputSize, string> = {
    sm: 'pl-10',
    md: 'pl-12',
    lg: 'pl-14',
}

export const INPUT_RIGHT_ICON_POSITIONS: Record<InputSize, string> = {
    sm: 'pr-10',
    md: 'pr-12',
    lg: 'pr-14',
}

export const INPUT_BASE_STYLES =
    'block w-full border rounded-md shadow-sm transition-colors focus:outline-none text-gray-900 focus:ring-2'

export const INPUT_CONTAINER_STYLES = 'space-y-1'
export const INPUT_FULL_WIDTH_STYLES = 'w-full'