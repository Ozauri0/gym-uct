'use client'

import React from 'react'

interface SelectLabelProps {
    children: React.ReactNode
    className?: string
}

export const SelectLabel: React.FC<SelectLabelProps> = ({
    children,
    className = '',
}) => {
    return (
        <div className={`text-sm font-medium text-gray-700 mb-1 ${className}`}>
            {children}
        </div>
    )
}