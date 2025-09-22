import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { UserLoginData } from '../types/auth'
import { createLogInValidator } from '../utils/loginValidator'

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Partial<UserLoginData & { general?: string }>>({})
    const router = useRouter()

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
            // Llamar a la API real de Next.js
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    rememberMe: data.rememberMe
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                setErrors({ general: result.error || 'Error al iniciar sesión' })
                return false
            }

            // Guardar token en localStorage para futuras requests
            if (result.tokens?.accessToken) {
                localStorage.setItem('accessToken', result.tokens.accessToken)
                localStorage.setItem('user', JSON.stringify(result.user))
            }

            // Redirigir al dashboard o página principal
            router.push('/')
            return true

        } catch (error) {
            console.error('Error en login:', error)
            setErrors({ general: 'Error de conexión. Intenta nuevamente.' })
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