'use client'

import React from 'react'
import { SelectStyleBuilder } from './styles/SelectStyles'

interface SelectItemProps {
    option: {
        value: string
        label: string
        disabled?: boolean
    }
    isSelected: boolean
    onSelect: (value: string) => void
}

export const SelectItem: React.FC<SelectItemProps> = ({
    option,
    isSelected,
    onSelect,
}) => {
    const handleClick = () => {
        if (!option.disabled) {
            onSelect(option.value)
        }
    }

    return (
        <div
            className={SelectStyleBuilder.buildItemStyles(option.disabled)}
            onClick={handleClick}
            aria-selected={isSelected}
            aria-disabled={option.disabled}
        >
            <div className="flex items-center justify-between">
                <span className={option.disabled ? 'text-gray-400' : ''}>
                    {option.label}
                </span>
                {isSelected && (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                )}
            </div>
        </div>
    )
}