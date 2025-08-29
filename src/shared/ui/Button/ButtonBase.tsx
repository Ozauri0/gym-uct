'use client'

import React from 'react'
import { ButtonBaseProps } from './types'

export const ButtonBase: React.FC<ButtonBaseProps> = ({
    children,
    loading = false,
    disabled = false,
    fullWidth = false,
    className = '',
    ...props
}) => {
    return (
        <button
            disabled={disabled || loading}
            className={className}
            aria-busy={loading}
            aria-disabled={disabled}
            {...props}
        >
            {children}
        </button>
    )
}