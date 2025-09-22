'use client'

import { useState } from 'react'
import { UserRegisterData, RegisterFormProps } from '../types/auth'
import { Input } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { Select } from '@/shared/ui/Select'
import { SelectValue } from '@/shared/ui/Select/types'


export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState<UserRegisterData>({
        name: '',
        email: '',
        rut: '',
        carrera: '',
        password: '',
        confirmPassword: '',
        role: ''
    })

    const [errors, setErrors] = useState<Partial<UserRegisterData>>({})

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Limpiar error cuando el usuario empiece a escribir
        if (errors[name as keyof UserRegisterData]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }))
        }
    }

    const handleSelectChange = (value: SelectValue) => {
        // Como es un select simple (no múltiple), value será string
        // Convertimos a string para asegurar la compatibilidad de tipos
        const roleValue = Array.isArray(value) ? value[0] || '' : value

        setFormData(prev => ({
            ...prev,
            role: roleValue
        }))

        // Limpiar error cuando el usuario seleccione una opción
        if (errors.role) {
            setErrors(prev => ({
                ...prev,
                role: undefined
            }))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    // Opciones para el select de roles
    const roleOptions = [
        { value: 'user', label: 'Usuario' },
        { value: 'admin', label: 'Administrador' },
        { value: 'student', label: 'Alumno' },
        { value: 'worker', label: 'Funcionario' },
    ]

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
            >
                {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
        </form>
    )
}