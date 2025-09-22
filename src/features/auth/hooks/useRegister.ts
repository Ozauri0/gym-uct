import { useState, useMemo } from 'react'
import { UserRegisterData } from '../types/auth'
import { createRegisterValidator } from '../utils/registerValidator'


export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Partial<UserRegisterData>>({})

    const clearFieldError = (field: keyof UserRegisterData) => {
        setErrors(prev => ({
            ...prev,
            [field]: undefined
        }))
    }

    // Principio OCP - Open/Closed Principle
    // El validador está abierto a extensión (puedo agregar nuevas reglas)
    // pero cerrado a modificación (no necesito cambiar su código interno)
    const validator = useMemo(() => createRegisterValidator(), [])

    const validateForm = (data: UserRegisterData): Partial<UserRegisterData> => {
        const result = validator.validate(data)
        return result.errors
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
            await new Promise(resolve => setTimeout(resolve, 2000))
            alert('Registro exitoso')
        } catch (error) {
            console.error('Error en el registro:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        errors,
        handleRegister,
        clearFieldError
    }
}