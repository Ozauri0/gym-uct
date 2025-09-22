'use client'

import React from 'react'
import { SelectStyleBuilder } from './styles/SelectStyles'

interface SelectTriggerProps {
    isOpen: boolean
    selectedLabel: string
    placeholder: string
    disabled: boolean
    error: boolean
    size: string
    className?: string
    onTrigger: () => void
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
    isOpen,
    selectedLabel,
    placeholder,
    disabled,
    error,
    size,
    className,
    onTrigger,
}) => {
    const triggerStyles = SelectStyleBuilder.buildTriggerStyles(
        size,
        error,
        disabled,
        className
    )

    return (
        <button
            type="button"
            className={triggerStyles}
            disabled={disabled}
            onClick={onTrigger}
            aria-expanded={isOpen}
        >
            <div className="flex items-center justify-between">
                <span className={!selectedLabel ? 'text-gray-400' : ''}>
                    {selectedLabel || placeholder}
                </span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </button>
    )
}