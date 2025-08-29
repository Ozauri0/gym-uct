'use client'

import React from 'react'
import { ColumnDefinition } from './types'
import { TableStyleBuilder } from './styles/TableStyles'
import { TableCell } from './TableCell'

interface TableRowProps<T> {
    item: T
    columns: ColumnDefinition<T>[]
    index: number
    striped: boolean
    hover: boolean
}

export const TableRow = <T,>({
    item,
    columns,
    index,
    striped,
    hover
}: TableRowProps<T>) => {
    return (
        <tr className={TableStyleBuilder.buildRowStyles(striped, hover, index)}>
            {columns.map((column) => (
                <TableCell
                    key={column.key}
                    item={item}
                    column={column}
                />
            ))}
        </tr>
    )
}