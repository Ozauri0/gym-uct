'use client'

import React from 'react'
import { ColumnDefinition } from './types'
import { TableStyleBuilder } from './styles/TableStyles'

interface TableCellProps<T> {
    item: T
    column: ColumnDefinition<T>
}

export const TableCell = <T,>({ item, column }: TableCellProps<T>) => {
    const content = column.render
        ? column.render(item)
        : (item as any)[column.key]

    return (
        <td className={TableStyleBuilder.buildCellStyles(column.align)}>
            {content}
        </td>
    )
}