'use client'

import React from 'react'

interface InputErrorProps {
    message?: string
    className?: string
    id?: string // Añadir la prop id
}

export const InputError: React.FC<InputErrorProps> = ({
    message,
    className = '',
    id,
}) => {
    if (!message) return null

    return (
        <p id={id} className={`text-sm text-red-600 ${className}`}>
            {message}
        </p>
    )
}