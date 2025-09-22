import { BadgeVariant, BadgeSize } from '../types'
import {
    BADGE_VARIANTS,
    BADGE_SIZES,
    BADGE_BASE_STYLES,
    BADGE_ROUNDED_STYLES,
    BADGE_DEFAULT_ROUNDED_STYLES,
    BADGE_INTERACTIVE_STYLES
} from './variants'

export class BadgeStyleBuilder {
    static buildStyles(
        variant: BadgeVariant,
        size: BadgeSize,
        rounded: boolean,
        interactive: boolean
    ): string {
        const variantStyle = BADGE_VARIANTS[variant]
        const sizeStyle = BADGE_SIZES[size]
        const roundedStyle = rounded ? BADGE_ROUNDED_STYLES : BADGE_DEFAULT_ROUNDED_STYLES
        const interactiveStyle = interactive ? BADGE_INTERACTIVE_STYLES : ''

        return [
            BADGE_BASE_STYLES,
            variantStyle,
            sizeStyle,
            roundedStyle,
            interactiveStyle,
        ].filter(Boolean).join(' ')
    }
}