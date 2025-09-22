import { useState, useMemo } from 'react'
import { UserLoginData } from '../types/auth'
import { createLogInValidator } from '../utils/loginValidator'


export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Partial<UserLoginData & { general?: string }>>({})

    const validator = useMemo(() => createLogInValidator(), [])

    const validateForm = (data: UserLoginData): Partial<UserLoginData> => {
        const result = validator.validate(data)
        return result.errors
    }

    const clearFieldError = (field: keyof UserLoginData) => {
        setErrors(prev => ({
            ...prev,
            [field]: undefined
        }))
    }

    const clearAllErrors = () => {
        setErrors({})
    }

    const handleLogin = async (data: UserLoginData): Promise<boolean> => {
        const validationErrors = validateForm(data)

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return false
        }

        setErrors({})
        setIsLoading(true)

        try {
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Simular éxito
            alert('Login exitoso')
            return true
        } catch (error) {
            console.error('Error en login:', error)
            setErrors({ general: 'Credenciales incorrectas. Intenta nuevamente.' })
            return false
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        errors,
        handleLogin,
        clearFieldError,
        clearAllErrors
    }
}