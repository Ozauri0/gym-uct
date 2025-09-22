'use client'

import { useState } from 'react'
import { UserRegisterData } from '../types/auth'

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Partial<UserRegisterData>>({})

    const validateForm = (data: UserRegisterData): Partial<UserRegisterData> => {
        const errors: Partial<UserRegisterData> = {}

        if (!data.name.trim()) {
            errors.name = 'El nombre es requerido'
        }

        if (!data.email.trim()) {
            errors.email = 'El email es requerido'
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = 'El email no es válido'
        }

        if (!data.password) {
            errors.password = 'La contraseña es requerida'
        } else if (data.password.length < 6) {
            errors.password = 'La contraseña debe tener al menos 6 caracteres'
        }

        if (!data.confirmPassword) {
            errors.confirmPassword = 'Confirma tu contraseña'
        } else if (data.password !== data.confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden'
        }

        return errors
    }

    const handleRegister = async (data: UserRegisterData) => {
        const validationErrors = validateForm(data)

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setErrors({})
        setIsLoading(true)

        try {
            // Aquí iría la llamada a la API
            console.log('Datos de registro:', data)
            await new Promise(resolve => setTimeout(resolve, 2000))
            console.log('Registro exitoso')
        } catch (error) {
            console.error('Error en el registro:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        errors,
        handleRegister
    }
}