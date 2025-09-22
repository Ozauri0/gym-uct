import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { UserRegisterData } from '../types/auth'
import { createRegisterValidator } from '../utils/registerValidator'

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Partial<UserRegisterData>>({})
    const router = useRouter()

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
            // Llamar a la API real de Next.js
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    rut: data.rut,
                    carrera: data.carrera,
                    password: data.password,
                    role: data.role || 'alumno'
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                // Manejar errores específicos del backend
                if (result.error.includes('Ya existe un usuario')) {
                    setErrors({ email: 'Este email ya está registrado' })
                } else if (result.error.includes('contraseña')) {
                    setErrors({ password: result.error })
                } else if (result.error.includes('email')) {
                    setErrors({ email: result.error })
                } else {
                    setErrors({ name: result.error })
                }
                return
            }

            // Registro exitoso - redirigir al login
            alert('¡Registro exitoso! Ahora puedes iniciar sesión.')
            router.push('/auth/login')

        } catch (error) {
            console.error('Error en el registro:', error)
            setErrors({ name: 'Error de conexión. Intenta nuevamente.' })
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