'use client'

import { useState } from 'react'
import { UserLoginData, LoginFormProps } from '../types/auth'
import { Input } from '@/shared/ui/Input'
import Link from 'next/link'
import { BaseAuthForm } from './BaseAuthForm'

export const LoginForm: React.FC<LoginFormProps> = ({
    onSubmit,
    isLoading,
    errors = {}
}) => {
    const [formData, setFormData] = useState<UserLoginData>({
        email: '',
        password: '',
        rememberMe: false
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <BaseAuthForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitText="Iniciar Sesión"
        >

            {errors.general && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {errors.general}
                </div>
            )}
            <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                error={errors.email}
                required
                autoComplete="email"
            />

            {/* Contraseña */}
            <Input
                label="Contraseña"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Ingresa tu contraseña"
                error={errors.password}
                required
                autoComplete="current-password"
            />

            {/* Recordarme y Olvidé contraseña */}
            <div className="flex items-center justify-between">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Recordarme</span>
                </label>

                <Link
                    href="/auth/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                >
                    ¿Olvidaste tu contraseña?
                </Link>
            </div>

        </BaseAuthForm>
    )
}