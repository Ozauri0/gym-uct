'use client'

import React from 'react'
import { SelectOption, SelectValue } from './types'
import { SelectStyleBuilder } from './styles/SelectStyles'
import { SelectItem } from './SelectItem'
import { SelectGroup } from './SelectGroup'

interface SelectContentProps {
    options: (SelectOption | { label: string, options: SelectOption[] })[]
    selectedValues: SelectValue
    onSelect: (value: string) => void
    multiple?: boolean
}

export const SelectContent: React.FC<SelectContentProps> = ({
    options,
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
        <div className={SelectStyleBuilder.buildContentStyles()}>
            {options.map((item, index) => {
                if ('options' in item) {
                    return (
                        <SelectGroup
                            key={index}
                            group={item}
                            selectedValues={selectedValues}
                            onSelect={onSelect}
                            multiple={multiple}
                        />
                    )
                } else {
                    return (
                        <SelectItem
                            key={item.value}
                            option={item}
                            isSelected={isSelected(item.value)}
                            onSelect={onSelect}
                        />
                    )
                }
            })}
        </div>
    )
}