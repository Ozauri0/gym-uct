'use client'

import React from 'react'
import { ColumnDefinition } from './types'
import { TableStyleBuilder } from './styles/TableStyles'
import { TableRow } from './TableRow'

interface TableBodyProps<T> {
    data: T[]
    columns: ColumnDefinition<T>[]
    keyExtractor: (item: T) => string
    striped: boolean
    hover: boolean
    emptyMessage?: string
}

export const TableBody = <T,>({
    data,
    columns,
    keyExtractor,
    striped,
    hover,
    emptyMessage
}: TableBodyProps<T>) => {
    if (data.length === 0) {
        return (
            <tbody>
                <tr>
                    <td
                        colSpan={columns.length}
                        className={TableStyleBuilder.buildEmptyStateStyles()}
                    >
                        {emptyMessage}
                    </td>
                </tr>
            </tbody>
        )
    }

    return (
        <tbody>
            {data.map((item, index) => (
                <TableRow
                    key={keyExtractor(item)}
                    item={item}
                    columns={columns}
                    index={index}
                    striped={striped}
                    hover={hover}
                />
            ))}
        </tbody>
    )
}