import { TABLE_SIZES, TABLE_SPACING, TABLE_ALIGNMENT } from './variants'

export class TableStyleBuilder {
    static buildTableStyles(size: string, className?: string): string {
        const sizeStyle = TABLE_SIZES[size as keyof typeof TABLE_SIZES] || TABLE_SIZES.md
        return `w-full border-collapse ${sizeStyle} ${className || ''}`
    }

    static buildHeaderStyles(): string {
        return `bg-gray-50 font-semibold text-gray-700 border-b border-gray-200`
    }

    static buildRowStyles(
        striped: boolean,
        hover: boolean,
        index: number
    ): string {
        const baseStyles = 'border-b border-gray-200 text-gray-900 transition-colors'
        const stripedStyle = striped && index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
        const hoverStyle = hover ? 'hover:bg-gray-100' : ''

        return `${baseStyles} ${stripedStyle} ${hoverStyle}`
    }

    static buildCellStyles(align: string = 'left'): string {
        const alignStyle = TABLE_ALIGNMENT[align as keyof typeof TABLE_ALIGNMENT] || TABLE_ALIGNMENT.left
        return `${alignStyle} ${TABLE_SPACING.md}`
    }

    static buildEmptyStateStyles(): string {
        return 'text-center text-gray-900 py-8'
    }
}