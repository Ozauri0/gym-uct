import { InputSize } from './types'

export const INPUT_DEFAULT_VALUES = {
    variant: 'primary' as const,
    size: 'md' as InputSize,
    fullWidth: false,
    disabled: false,
    required: false,
    rounded: false,
}

export const INPUT_ICON_SIZES: Record<InputSize, string> = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
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

export const INPUT_TEST_IDS = {
    container: 'input-container',
    base: 'input-base',
    label: 'input-label',
    error: 'input-error',
    helper: 'input-helper',
    leftIcon: 'input-left-icon',
    rightIcon: 'input-right-icon',
}

export const INPUT_ARIA_ATTRIBUTES = {
    describedBy: (id: string) => `${id}-description`,
    error: (id: string) => `${id}-error`,
}