'use client'

import React from 'react'
import { InputBaseProps } from './types'

export const InputBase: React.FC<InputBaseProps> = ({
    className = '',
    ...props
}) => {
    return (
        <input
            className={className}
            {...props}
        />
    )
}