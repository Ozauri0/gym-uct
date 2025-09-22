'use client'

import { Select, SelectOption, SelectValue } from '@/shared/ui'
import { useState } from 'react'

export default function SelectTest() {
    const [selectedValue, setSelectedValue] = useState<SelectValue>('')
    const [multipleValues, setMultipleValues] = useState<SelectValue>([])

    // Función de manejo para selects simples
    const handleSingleChange = (value: SelectValue) => {
        if (typeof value === 'string') {
            setSelectedValue(value)
        }
    }

    // Función de manejo para selects múltiples
    const handleMultipleChange = (value: SelectValue) => {
        if (Array.isArray(value)) {
            setMultipleValues(value)
        }
    }

    const simpleOptions: SelectOption[] = [
        { value: 'option1', label: 'Opción 1' },
        { value: 'option2', label: 'Opción 2' },
        { value: 'option3', label: 'Opción 3', disabled: true },
    ]

    const groupedOptions = [
        {
            label: 'Frutas',
            options: [
                { value: 'apple', label: 'Manzana' },
                { value: 'banana', label: 'Plátano' },
            ]
        },
        {
            label: 'Verduras',
            options: [
                { value: 'carrot', label: 'Zanahoria' },
                { value: 'broccoli', label: 'Brócoli' },
            ]
        }
    ]

    return (
        <div className="p-8 space-y-6">
            {/* Select simple */}
            <Select
                label="Selección simple"
                value={selectedValue}
                onChange={handleSingleChange}
                options={simpleOptions}
                placeholder="Elige una opción"
            />

            {/* Select múltiple */}
            <Select
                label="Selección múltiple"
                value={multipleValues}
                onChange={handleMultipleChange}
                options={simpleOptions}
                multiple
                placeholder="Elige varias opciones"
            />

            {/* Select con grupos */}
            <Select
                label="Select con grupos"
                options={groupedOptions}
                placeholder="Elige una categoría"
            />

            {/* Select con error */}
            <Select
                label="Select con error"
                options={simpleOptions}
                error
                helperText="Este campo es requerido"
            />

            {/* Select deshabilitado */}
            <Select
                label="Select deshabilitado"
                options={simpleOptions}
                disabled
                helperText="Campo no disponible"
            />

            {/* Mostrar valores seleccionados */}
            <div className="p-4 bg-gray-100 rounded-lg text-gray-800">
                <h3 className="font-semibold mb-2">Valores seleccionados:</h3>
                <p>Simple: {selectedValue.toString()}</p>
                <p>Múltiple: {Array.isArray(multipleValues) ? multipleValues.join(', ') : 'Ninguno'}</p>
            </div>
        </div>
    )
}