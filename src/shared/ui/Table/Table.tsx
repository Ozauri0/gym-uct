'use client'

import React from 'react'
import { TableProps } from './types'
import { TABLE_DEFAULT_VALUES } from './styles/variants'
import { TableStyleBuilder } from './styles/TableStyles'
import { TableHeader } from './TableHeader'
import { TableBody } from './TableBody'

export const Table = <T,>({
    data,
    columns,
    keyExtractor,
    emptyMessage = TABLE_DEFAULT_VALUES.emptyMessage,
    striped = TABLE_DEFAULT_VALUES.striped,
    hover = TABLE_DEFAULT_VALUES.hover,
    size = TABLE_DEFAULT_VALUES.size,
    className = ''
}: TableProps<T>) => {
    const tableStyles = TableStyleBuilder.buildTableStyles(size, className)

    return (
        <div className="overflow-x-auto">
            <table className={tableStyles}>
                <TableHeader columns={columns} />
                <TableBody
                    data={data}
                    columns={columns}
                    keyExtractor={keyExtractor}
                    striped={striped}
                    hover={hover}
                    emptyMessage={emptyMessage}
                />
            </table>
        </div>
    )
}