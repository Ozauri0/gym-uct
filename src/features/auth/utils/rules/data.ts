import { ValidationRule, UserRegisterData } from '../../types/auth'

export const createRequiredRule = (field: keyof UserRegisterData, message: string): ValidationRule => ({
    field,
    validate: (value: any) => {
        if (!value || (typeof value === 'string' && !value.trim())) {
            return message
        }
        return undefined
    }
})

export const createPasswordLengthRule = (minLength: number, message: string): ValidationRule => ({
    field: 'password',
    validate: (value: string) => {
        if (value && value.length < minLength) {
            return message
        }
        return undefined
    }
})

export const createEmailRule = (message: string): ValidationRule => ({
    field: 'email',
    validate: (value: string) => {
        if (value && !/\S+@\S+\.\S+/.test(value)) {
            return message
        }
        return undefined
    }
})

export const createConfirmPasswordRule = (message: string): ValidationRule => ({
    field: 'confirmPassword',
    validate: (value: string, formData?: UserRegisterData) => {
        if (value && formData && value !== formData.password) {
            return message
        }
        return undefined
    }
})

export const createRutFormatRule = (message: string): ValidationRule => ({
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

// Validador específico del dígito verificador del RUT
export const createRutDvRule = (message: string): ValidationRule => ({
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

// Validador de letra mayúscula en contraseña
export const createUpperCaseRule = (message: string): ValidationRule => ({
    field: 'password',
    validate: (value: string) => {
        if (!value) return undefined

        if (!/[A-Z]/.test(value)) {
            return message
        }

        return undefined
    }
})

// Validador de punto en contraseña
export const createDotRule = (message: string): ValidationRule => ({
    field: 'password',
    validate: (value: string) => {
        if (!value) return undefined

        if (!/\./.test(value)) {
            return message
        }

        return undefined
    }
})

// Validador de símbolo en contraseña
export const createSymbolRule = (message: string): ValidationRule => ({
    field: 'password',
    validate: (value: string) => {
        if (!value) return undefined

        if (!/[^a-zA-Z0-9\s]/.test(value)) {
            return message
        }

        return undefined
    }
})

// Combinador de reglas, para usar múltiples validaciones)
export const combineRules = (rules: ValidationRule[]): ValidationRule => ({
    field: rules[0]?.field || 'field',
    validate: (value: string) => {
        for (const rule of rules) {
            const error = rule.validate(value)
            if (error) {
                return error
            }
        }
        return undefined
    }
})
