import { SELECT_SIZES, SELECT_STYLES } from '../constants'

export class SelectStyleBuilder {
    static buildTriggerStyles(
        size: string,
        error: boolean,
        disabled: boolean,
        className?: string
    ): string {
        const sizeStyle = SELECT_SIZES[size as keyof typeof SELECT_SIZES] || SELECT_SIZES.md
        const stateStyle = disabled
            ? SELECT_STYLES.disabled
            : error
                ? SELECT_STYLES.error
                : SELECT_STYLES.normal

        return [
            SELECT_STYLES.base,
            sizeStyle,
            stateStyle,
            className,
        ].filter(Boolean).join(' ')
    }

    static buildContentStyles(): string {
        return 'bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-auto'
    }

    static buildItemStyles(disabled?: boolean): string {
        const baseStyles = 'px-4 py-2 cursor-pointer transition-colors text-gray-600'
        const disabledStyles = disabled ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'

        return `${baseStyles} ${disabledStyles}`
    }

    static buildLabelStyles(): string {
        return 'px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50'
    }

    static buildGroupStyles(): string {
        return 'space-y-1 text-gray-900'
    }
}