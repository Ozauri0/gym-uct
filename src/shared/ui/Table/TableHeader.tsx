'use client'

import React from 'react'
import { ColumnDefinition } from './types'
import { TableStyleBuilder } from './styles/TableStyles'

interface TableHeaderProps<T> {
    columns: ColumnDefinition<T>[]
}

export const TableHeader = <T,>({ columns }: TableHeaderProps<T>) => {
    return (
        <thead>
            <tr>
                {columns.map((column) => (
                    <th
                        key={column.key}
                        className={`${TableStyleBuilder.buildHeaderStyles()} ${TableStyleBuilder.buildCellStyles(column.align)}`}
                        style={{ width: column.width }}
                    >
                        {column.header}
                    </th>
                ))}
            </tr>
        </thead>
    )
}