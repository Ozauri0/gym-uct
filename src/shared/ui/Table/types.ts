import { ReactNode } from 'react'

export interface ColumnDefinition<T> {
    key: string
    header: string
    render?: (item: T) => ReactNode
    align?: 'left' | 'center' | 'right'
    width?: string
}

export interface TableProps<T> {
    data: T[]
    columns: ColumnDefinition<T>[]
    keyExtractor: (item: T) => string
    emptyMessage?: string
    striped?: boolean
    hover?: boolean
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    pageSize?: number
    onPageSizeChange?: (size: number) => void
}