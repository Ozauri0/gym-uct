'use client'

import { Input } from '@/shared/ui'
import { useState } from 'react'

export default function TestInputPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    })

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-md mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Prueba del Componente Input</h1>

                {/* Input básico con label */}
                <Input
                    label="Nombre completo"
                    placeholder="Ingresa tu nombre"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                />

                {/* Input con tipo email */}
                <Input
                    label="Email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                />

                {/* Input con tipo password */}
                <Input
                    label="Contraseña"
                    type="password"
                    placeholder="Crea una contraseña segura"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                />

                {/* Input con error */}
                <Input
                    label="Confirmar contraseña"
                    type="password"
                    error="Las contraseñas no coinciden"
                />

                {/* Input con helper text */}
                <Input
                    label="Teléfono"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    helperText="Formato internacional preferido"
                />

                {/* Input deshabilitado */}
                <Input
                    label="Campo deshabilitado"
                    value="Valor predeterminado"
                    disabled
                />

                {/* Diferentes tamaños */}
                <div className="space-y-2">
                    <h3 className="font-medium text-gray-700">Tamaños:</h3>
                    <Input size="sm" placeholder="Small size" />
                    <Input size="md" placeholder="Medium size" />
                    <Input size="lg" placeholder="Large size" />
                </div>

                {/* Diferentes variantes */}
                <div className="space-y-2">
                    <h3 className="font-medium text-gray-700">Variantes:</h3>
                    <Input variant="primary" placeholder="Primary variant" />
                    <Input variant="secondary" placeholder="Secondary variant" />
                    <Input variant="success" placeholder="Success variant" />
                    <Input variant="error" placeholder="Error variant" />
                </div>

                {/* Input sin label */}
                <Input
                    placeholder="Input sin etiqueta"
                />

                {/* Estado actual del formulario */}
                <div className="mt-8 p-4 bg-white rounded-lg border">
                    <h3 className="font-medium text-gray-700 mb-2">Estado del formulario:</h3>
                    <pre className="text-sm text-gray-600">
                        {JSON.stringify(formData, null, 2)}
                    </pre>
                </div>
            </div>
        </div>
    )
}