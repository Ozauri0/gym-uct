import { InputVariant, InputSize } from '../types'
import {
    INPUT_VARIANTS,
    INPUT_SIZES,
    INPUT_BASE_STYLES,
    INPUT_ICON_POSITIONS,
    INPUT_RIGHT_ICON_POSITIONS
} from './variants'

export class InputStyleBuilder {
    static buildInputStyles(
        variant: InputVariant,
        size: InputSize,
        disabled: boolean,
        hasLeftIcon: boolean,
        hasRightIcon: boolean
    ): string {
        // Usar 'as InputVariant' para asegurar el tipo
        const actualVariant = disabled ? 'disabled' as InputVariant : variant
        const variantStyle = INPUT_VARIANTS[actualVariant]

        // Usar 'as InputSize' para asegurar el tipo
        const sizeStyle = INPUT_SIZES[size as InputSize]

        const paddingStyles = this.getPaddingStyles(
            size as InputSize,
            hasLeftIcon,
            hasRightIcon
        )

        return [
            INPUT_BASE_STYLES,
            variantStyle,
            sizeStyle,
            paddingStyles,
        ].filter(Boolean).join(' ')
    }

    static buildContainerStyles(
        fullWidth: boolean,
        className?: string
    ): string {
        const widthStyle = fullWidth ? 'w-full' : ''

        return [
            'space-y-1',
            widthStyle,
            className,
        ].filter(Boolean).join(' ')
    }

    // TODO: Refactorizar
    private static getPaddingStyles(
        size: InputSize,
        hasLeftIcon: boolean,
        hasRightIcon: boolean
    ): string {
        if (hasLeftIcon && hasRightIcon) {
            return `${INPUT_ICON_POSITIONS[size]} ${INPUT_RIGHT_ICON_POSITIONS[size]}`
        }
        if (hasLeftIcon) {
            return INPUT_ICON_POSITIONS[size]
        }
        if (hasRightIcon) {
            return INPUT_RIGHT_ICON_POSITIONS[size]
        }
        return ''
    }
}