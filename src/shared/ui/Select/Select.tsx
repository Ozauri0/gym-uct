'use client'

import React, { useState, useRef, useEffect } from 'react'
import { SelectProps, SelectValue } from './types'
import { SELECT_DEFAULT_VALUES } from './constants'
import { SelectTrigger } from './SelectTrigger'
import { SelectContent } from './SelectContent'
import { SelectLabel as SelectLabelComponent } from './SelectLabel'

export const Select: React.FC<SelectProps> = ({
    value,
    onChange,
    options,
    placeholder = SELECT_DEFAULT_VALUES.placeholder,
    disabled = SELECT_DEFAULT_VALUES.disabled,
    error = false,
    size = SELECT_DEFAULT_VALUES.size,
    className = '',
    multiple = SELECT_DEFAULT_VALUES.multiple,
    label,
    helperText,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const selectRef = useRef<HTMLDivElement>(null)

    const selectedValues = value || (multiple ? [] : '')

    const getSelectedLabel = (): string => {
        if (multiple && Array.isArray(selectedValues)) {
            const selectedOptions = options.flatMap(opt =>
                'options' in opt
                    ? opt.options.filter(o => selectedValues.includes(o.value))
                    : selectedValues.includes(opt.value) ? [opt] : []
            )
            return selectedOptions.map(opt => opt.label).join(', ')
        }

        const findOption = (opts: any[]): string => {
            for (const opt of opts) {
                if ('options' in opt) {
                    const found = opt.options.find((o: any) => o.value === selectedValues)
                    if (found) return found.label
                } else if (opt.value === selectedValues) {
                    return opt.label
                }
            }
            return ''
        }

        return findOption(options)
    }

    const handleSelect = (selectedValue: string) => {
        if (multiple) {
            const currentValues = Array.isArray(selectedValues) ? selectedValues : []
            const newValues = currentValues.includes(selectedValue)
                ? currentValues.filter(v => v !== selectedValue)
                : [...currentValues, selectedValue]

            onChange?.(newValues)
        } else {
            onChange?.(selectedValue)
            setIsOpen(false)
        }
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
            setIsOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div ref={selectRef} className="relative">
            {label && <SelectLabelComponent>{label}</SelectLabelComponent>}

            <SelectTrigger
                isOpen={isOpen}
                selectedLabel={getSelectedLabel()}
                placeholder={placeholder}
                disabled={disabled}
                error={error}
                size={size}
                className={className}
                onTrigger={() => !disabled && setIsOpen(!isOpen)}
            />

            {isOpen && !disabled && (
                <SelectContent
                    options={options}
                    selectedValues={selectedValues}
                    onSelect={handleSelect}
                    multiple={multiple}
                />
            )}

            {helperText && (
                <p className={`text-sm mt-1 ${error ? 'text-red-600' : 'text-gray-500'}`}>
                    {helperText}
                </p>
            )}
        </div>
    )
}