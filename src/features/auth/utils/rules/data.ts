import { ValidationRule, UserRegisterData, UserLoginData } from '../../types/auth'

// Factory function genérica para reglas requeridas
export const createRequiredRule = <T extends object>(
    field: keyof T,
    message: string
): ValidationRule<T> => ({
    field,
    validate: (value: any) => {
        if (!value || (typeof value === 'string' && !value.trim())) {
            return message
        }
        return undefined
    }
})

// Factory function para validación de email (genérica)
export const createEmailRule = <T extends { email: string }>(
    message: string
): ValidationRule<T> => ({
    field: 'email' as keyof T,
    validate: (value: string) => {
        if (value && !/\S+@\S+\.\S+/.test(value)) {
            return message
        }
        return undefined
    }
})

// Factory function para longitud de password (genérica)
export const createPasswordLengthRule = <T extends { password: string }>(
    minLength: number,
    message: string
): ValidationRule<T> => ({
    field: 'password' as keyof T,
    validate: (value: string) => {
        if (value && value.length < minLength) {
            return message
        }
        return undefined
    }
})

// Factory function para confirmación de password (específica para registro)
export const createConfirmPasswordRule = (
    message: string
): ValidationRule<UserRegisterData> => ({
    field: 'confirmPassword',
    validate: (value: string, formData?: UserRegisterData) => {
        if (value && formData && value !== formData.password) {
            return message
        }
        return undefined
    }
})

// Factory function para formato de RUT (específica para registro)
export const createRutFormatRule = (
    message: string
): ValidationRule<UserRegisterData> => ({
    field: 'rut',
    validate: (value: string) => {
        if (!value) return undefined

        const rutLimpio = value.replace(/\./g, '').replace(/-/g, '').toUpperCase().trim()

        if (rutLimpio.length < 8) {
            return message
        }

        if (!/^\d+[0-9K]$/.test(rutLimpio)) {
            return message
        }

        return undefined
    }
})

// Factory function para dígito verificador del RUT (específica para registro)
export const createRutDvRule = (
    message: string
): ValidationRule<UserRegisterData> => ({
    field: 'rut',
    validate: (value: string) => {
        if (!value) return undefined

        const rutLimpio = value.replace(/\./g, '').replace(/-/g, '').toUpperCase().trim()
        const numero = rutLimpio.slice(0, -1)
        const dv = rutLimpio.slice(-1)

        let suma = 0
        let multiplicador = 2

        for (let i = numero.length - 1; i >= 0; i--) {
            suma += parseInt(numero[i]) * multiplicador
            multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
        }

        const resto = suma % 11
        let dvEsperado = (11 - resto).toString()

        if (dvEsperado === '11') dvEsperado = '0'
        if (dvEsperado === '10') dvEsperado = 'K'

        if (dv !== dvEsperado) {
            return message
        }

        return undefined
    }
})

// Factory function para letra mayúscula en contraseña (genérica)
export const createUpperCaseRule = <T extends { password: string }>(
    message: string
): ValidationRule<T> => ({
    field: 'password' as keyof T,
    validate: (value: string) => {
        if (!value) return undefined

        if (!/[A-Z]/.test(value)) {
            return message
        }

        return undefined
    }
})

// Factory function para punto en contraseña (genérica)
export const createDotRule = <T extends { password: string }>(
    message: string
): ValidationRule<T> => ({
    field: 'password' as keyof T,
    validate: (value: string) => {
        if (!value) return undefined

        if (!/\./.test(value)) {
            return message
        }

        return undefined
    }
})

// Factory function para símbolo en contraseña (genérica)
export const createSymbolRule = <T extends { password: string }>(
    message: string
): ValidationRule<T> => ({
    field: 'password' as keyof T,
    validate: (value: string) => {
        if (!value) return undefined

        if (!/[^a-zA-Z0-9\s]/.test(value)) {
            return message
        }

        return undefined
    }
})

// Factory function para número en contraseña (genérica)
export const createNumberRule = <T extends { password: string }>(
    message: string
): ValidationRule<T> => ({
    field: 'password' as keyof T,
    validate: (value: string) => {
        if (!value) return undefined

        if (!/\d/.test(value)) {
            return message
        }

        return undefined
    }
})

// Combinador de reglas genérico
export const combineRules = <T extends object>(
    rules: ValidationRule<T>[]
): ValidationRule<T> => ({
    field: rules[0]?.field || 'field' as keyof T,
    validate: (value: any, formData?: T) => {
        for (const rule of rules) {
            const error = rule.validate(value, formData)
            if (error) {
                return error
            }
        }
        return undefined
    }
})

// Factory function para validación personalizada genérica
export const createCustomRule = <T extends object>(
    field: keyof T,
    validateFn: (value: any, formData?: T) => string | undefined
): ValidationRule<T> => ({
    field,
    validate: validateFn
})