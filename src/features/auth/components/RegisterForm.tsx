'use client'

import { useState } from 'react'
import { UserRegisterData, RegisterFormProps } from '../types/auth'
import { Input } from '@/shared/ui/Input'
import { Select } from '@/shared/ui/Select'
import { SelectValue } from '@/shared/ui/Select/types'
import { BaseAuthForm } from './BaseAuthForm'

export const RegisterForm: React.FC<RegisterFormProps> = ({
    onSubmit,
    isLoading,
    errors = {},
    onFieldChange
}) => {
    const [formData, setFormData] = useState<UserRegisterData>({
        name: '',
        email: '',
        rut: '',
        carrera: '',
        password: '',
        confirmPassword: '',
        role: ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Notificar al padre sobre el cambio (para limpiar errores)
        onFieldChange?.(name as keyof UserRegisterData)
    }

    const handleSelectChange = (value: SelectValue) => {
        const roleValue = Array.isArray(value) ? value[0] || '' : value

        setFormData(prev => ({
            ...prev,
            role: roleValue
        }))

        onFieldChange?.('role')
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const roleOptions = [
        { value: 'user', label: 'Usuario' },
        { value: 'admin', label: 'Administrador' },
        { value: 'student', label: 'Alumno' },
        { value: 'worker', label: 'Funcionario' },
    ]

    return (
        <BaseAuthForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitText="Crear cuenta"
        >
            <Input
                label="Nombre completo"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ingresa tu nombre completo"
                error={errors.name}
                required
            />

            <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                error={errors.email}
                required
            />

            <Input
                label="Rut"
                type="text"
                name="rut"
                value={formData.rut}
                onChange={handleInputChange}
                placeholder="11.223.445-6"
                error={errors.rut}
                required
            />

            <Input
                label="Carrera"
                type="text"
                name="carrera"
                value={formData.carrera}
                onChange={handleInputChange}
                placeholder="Ingresa tu carrera"
                error={errors.carrera}
                required
            />

            <Input
                label="Contraseña"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Mínimo 8 caracteres"
                error={errors.password}
                required
            />

            <Input
                label="Confirmar contraseña"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Repite tu contraseña"
                error={errors.confirmPassword}
                required
            />

            <Select
                label="Rol de usuario"
                value={formData.role}
                onChange={handleSelectChange}
                options={roleOptions}
                placeholder="Selecciona un rol"
                error={!!errors.role}
                helperText={errors.role}
            />
        </BaseAuthForm>
    )
}