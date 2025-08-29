'use client'

import React from 'react'

interface InputLabelProps {
    htmlFor?: string
    children: React.ReactNode
    required?: boolean
    className?: string
}

export const InputLabel: React.FC<InputLabelProps> = ({
    htmlFor,
    children,
    required = false,
    className = '',
}) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`block text-sm font-medium text-gray-700 ${className}`}
        >
            {children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    )
}