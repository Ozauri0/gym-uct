import { ButtonVariant, ButtonSize } from '../types'
import { BUTTON_VARIANTS, BUTTON_SIZES, BUTTON_BASE_STYLES } from './variants'

export class ButtonStyleBuilder {
  static buildStyles(
    variant: ButtonVariant,
    size: ButtonSize,
    error: boolean,
    disabled: boolean,
    loading: boolean,
    fullWidth: boolean
  ): string {
    const variantStyle = error ? BUTTON_VARIANTS.danger : BUTTON_VARIANTS[variant]
    const sizeStyle = BUTTON_SIZES[size]
    const widthStyle = fullWidth ? 'w-full' : ''
    const stateStyle = disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
    const loadingStyle = loading ? 'cursor-wait' : ''

    return [
      BUTTON_BASE_STYLES,
      variantStyle,
      sizeStyle,
      widthStyle,
      stateStyle,
      loadingStyle,
    ].filter(Boolean).join(' ')
  }
}