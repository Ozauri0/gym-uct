'use client'

import React from 'react'
import { PaginationProps } from './types'
import { PAGINATION_OPTIONS } from './constants'

export const TablePagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    pageSize,
    onPageSizeChange
}) => {
    const canPrevious = currentPage > 1
    const canNext = currentPage < totalPages

    return (
        <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Mostrar</span>
                {onPageSizeChange && (
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    >
                        {PAGINATION_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                )}
                <span className="text-sm text-gray-700">registros</span>
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!canPrevious}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Anterior
                </button>

                <span className="text-sm text-gray-700">
                    Página {currentPage} de {totalPages}
                </span>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!canNext}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Siguiente
                </button>
            </div>
        </div>
    )
}