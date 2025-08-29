'use client'

import React from 'react'
import { SelectStyleBuilder } from './styles/SelectStyles'
import { SelectItem } from './SelectItem'
import { SelectValue } from './types'

interface SelectGroupProps {
    group: {
        label: string
        options: Array<{
            value: string
            label: string
            disabled?: boolean
        }>
    }
    selectedValues: SelectValue
    onSelect: (value: string) => void
    multiple?: boolean
}

export const SelectGroup: React.FC<SelectGroupProps> = ({
    group,
    selectedValues,
    onSelect,
    multiple,
}) => {
    const isSelected = (value: string) => {
        return multiple
            ? Array.isArray(selectedValues) && selectedValues.includes(value)
            : selectedValues === value
    }

    return (
        <div className={SelectStyleBuilder.buildGroupStyles()}>
            <div className={SelectStyleBuilder.buildLabelStyles()}>
                {group.label}
            </div>
            {group.options.map((option) => (
                <SelectItem
                    key={option.value}
                    option={option}
                    isSelected={isSelected(option.value)}
                    onSelect={onSelect}
                />
            ))}
        </div>
    )
}