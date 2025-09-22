import { FormValidator } from './validator'
import {
    createRequiredRule,
    createEmailRule,
    createPasswordLengthRule,
    createConfirmPasswordRule,
    createRutFormatRule,
    createRutDvRule,
    createUpperCaseRule,
    createDotRule,
    createSymbolRule,
    combineRules
} from './rules/data'
import { ValidationRule } from '../types/auth'

// Factory para crear el validador de registro
export const createRegisterValidator = (): FormValidator => {
    const validator = new FormValidator()

    // Crear reglas combinadas para RUT y contraseña
    const rutValidator = combineRules([
        createRutFormatRule('El formato del RUT no es válido'),
        createRutDvRule('El dígito verificador del RUT es incorrecto')
    ])

    const passwordValidator = combineRules([
        createPasswordLengthRule(8, 'La contraseña debe tener al menos 8 caracteres'),
        createUpperCaseRule('La contraseña debe contener al menos una letra mayúscula'),
        createDotRule('La contraseña debe contener al menos un punto'),
        createSymbolRule('La contraseña debe contener al menos un símbolo')
    ])

    validator.addRules([
        createRequiredRule('name', 'El nombre es requerido'),
        createRequiredRule('email', 'El email es requerido'),
        createEmailRule('El email no es válido'),
        createRequiredRule('rut', 'El RUT es requerido'),
        rutValidator,
        createRequiredRule('carrera', 'La carrera es requerida'),
        createRequiredRule('password', 'La contraseña es requerida'),
        passwordValidator,
        createRequiredRule('confirmPassword', 'Confirma tu contraseña'),
        createConfirmPasswordRule('Las contraseñas no coinciden')
    ])

    return validator
}

// Versión extensible con opciones configurables
export const createCustomRegisterValidator = (options?: {
    minPasswordLength?: number
    requireUpperCase?: boolean
    requireDot?: boolean
    requireSymbol?: boolean
    validateRut?: boolean
    customRules?: ValidationRule[]
}): FormValidator => {
    const validator = new FormValidator()
    const minPasswordLength = options?.minPasswordLength || 8
    const validateRut = options?.validateRut ?? true

    // Reglas base
    const baseRules: ValidationRule[] = [
        createRequiredRule('name', 'El nombre es requerido'),
        createRequiredRule('email', 'El email es requerido'),
        createEmailRule('El email no es válido'),
        createRequiredRule('rut', 'El RUT es requerido'),
        createRequiredRule('carrera', 'La carrera es requerida'),
        createRequiredRule('password', 'La contraseña es requerida'),
        createPasswordLengthRule(minPasswordLength, `La contraseña debe tener al menos ${minPasswordLength} caracteres`),
        createRequiredRule('confirmPassword', 'Confirma tu contraseña'),
        createConfirmPasswordRule('Las contraseñas no coinciden')
    ]

    // Agregar validación de RUT si está habilitada
    if (validateRut) {
        const rutValidator = combineRules([
            createRutFormatRule('El formato del RUT no es válido'),
            createRutDvRule('El dígito verificador del RUT es incorrecto')
        ])
        baseRules.splice(4, 0, rutValidator) // Insertar después del requiredRule de RUT
    }

    // Reglas de contraseña avanzadas
    const passwordRules: ValidationRule[] = []

    if (options?.requireUpperCase !== false) {
        passwordRules.push(createUpperCaseRule('La contraseña debe contener al menos una letra mayúscula'))
    }

    if (options?.requireDot !== false) {
        passwordRules.push(createDotRule('La contraseña debe contener al menos un punto'))
    }

    if (options?.requireSymbol !== false) {
        passwordRules.push(createSymbolRule('La contraseña debe contener al menos un símbolo'))
    }

    // Combinar todas las reglas de contraseña
    if (passwordRules.length > 0) {
        const passwordValidator = combineRules(passwordRules)
        baseRules.splice(7, 0, passwordValidator) // Insertar después del passwordLengthRule
    }

    validator.addRules(baseRules)

    // Reglas personalizadas adicionales
    if (options?.customRules) {
        validator.addRules(options.customRules)
    }

    return validator
}

// Versión simplificada para casos específicos
export const createBasicRegisterValidator = (): FormValidator => {
    const validator = new FormValidator()

    validator.addRules([
        createRequiredRule('name', 'El nombre es requerido'),
        createRequiredRule('email', 'El email es requerido'),
        createEmailRule('El email no es válido'),
        createRequiredRule('rut', 'El RUT es requerido'),
        createRutFormatRule('El formato del RUT no es válido'),
        createRequiredRule('carrera', 'La carrera es requerida'),
        createRequiredRule('password', 'La contraseña es requerida'),
        createPasswordLengthRule(6, 'La contraseña debe tener al menos 6 caracteres'),
        createRequiredRule('confirmPassword', 'Confirma tu contraseña'),
        createConfirmPasswordRule('Las contraseñas no coinciden')
    ])

    return validator
}