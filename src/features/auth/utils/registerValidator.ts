import { FormValidator } from './validator'
import { UserRegisterData } from '../types/auth'
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
    createNumberRule,
    combineRules
} from './rules/data'
import { ValidationRule } from '../types/auth'

// Factory para crear el validador de registro
export const createRegisterValidator = (): FormValidator<UserRegisterData> => {
    const validator = new FormValidator<UserRegisterData>()

    // Crear reglas combinadas para RUT y contraseña
    const rutValidator = combineRules<UserRegisterData>([
        createRutFormatRule('El formato del RUT no es válido'),
        createRutDvRule('El dígito verificador del RUT es incorrecto')
    ])

    const passwordValidator = combineRules<UserRegisterData>([
        createPasswordLengthRule<UserRegisterData>(8, 'La contraseña debe tener al menos 8 caracteres'),
        createUpperCaseRule<UserRegisterData>('La contraseña debe contener al menos una letra mayúscula'),
        createDotRule<UserRegisterData>('La contraseña debe contener al menos un punto'),
        createSymbolRule<UserRegisterData>('La contraseña debe contener al menos un símbolo'),
        createNumberRule<UserRegisterData>('La contraseña debe contener al menos un número')
    ])

    validator.addRules([
        createRequiredRule('name', 'El nombre es requerido'),
        createRequiredRule('email', 'El email es requerido'),
        createEmailRule<UserRegisterData>('El email no es válido'),
        createRequiredRule('rut', 'El RUT es requerido'),
        rutValidator,
        createRequiredRule('carrera', 'La carrera es requerida'),
        createRequiredRule('password', 'La contraseña es requerida'),
        passwordValidator,
        createRequiredRule('confirmPassword', 'Confirma tu contraseña'),
        createConfirmPasswordRule('Las contraseñas no coinciden'),
        createRequiredRule('role', 'El rol es requerido')
    ])

    return validator
}

// Interface para opciones configurables
interface RegisterValidatorOptions {
    minPasswordLength?: number
    requireUpperCase?: boolean
    requireDot?: boolean
    requireSymbol?: boolean
    requireNumber?: boolean
    validateRut?: boolean
    customRules?: ValidationRule<UserRegisterData>[]
}

// Versión extensible con opciones configurables
export const createCustomRegisterValidator = (
    options: RegisterValidatorOptions = {}
): FormValidator<UserRegisterData> => {
    const validator = new FormValidator<UserRegisterData>()
    const {
        minPasswordLength = 8,
        requireUpperCase = true,
        requireDot = true,
        requireSymbol = true,
        requireNumber = true,
        validateRut = true,
        customRules = []
    } = options

    // Reglas base
    const baseRules: ValidationRule<UserRegisterData>[] = [
        createRequiredRule('name', 'El nombre es requerido'),
        createRequiredRule('email', 'El email es requerido'),
        createEmailRule<UserRegisterData>('El email no es válido'),
        createRequiredRule('rut', 'El RUT es requerido'),
        createRequiredRule('carrera', 'La carrera es requerida'),
        createRequiredRule('password', 'La contraseña es requerida'),
        createPasswordLengthRule<UserRegisterData>(
            minPasswordLength,
            `La contraseña debe tener al menos ${minPasswordLength} caracteres`
        ),
        createRequiredRule('confirmPassword', 'Confirma tu contraseña'),
        createConfirmPasswordRule('Las contraseñas no coinciden'),
        createRequiredRule('role', 'El rol es requerido')
    ]

    // Agregar validación de RUT si está habilitada
    if (validateRut) {
        const rutValidator = combineRules<UserRegisterData>([
            createRutFormatRule('El formato del RUT no es válido'),
            createRutDvRule('El dígito verificador del RUT es incorrecto')
        ])
        // Insertar después del requiredRule de RUT
        baseRules.splice(4, 0, rutValidator)
    }

    // Reglas de contraseña avanzadas
    const passwordRules: ValidationRule<UserRegisterData>[] = []

    if (requireUpperCase) {
        passwordRules.push(createUpperCaseRule<UserRegisterData>('La contraseña debe contener al menos una letra mayúscula'))
    }

    if (requireDot) {
        passwordRules.push(createDotRule<UserRegisterData>('La contraseña debe contener al menos un punto'))
    }

    if (requireSymbol) {
        passwordRules.push(createSymbolRule<UserRegisterData>('La contraseña debe contener al menos un símbolo'))
    }

    if (requireNumber) {
        passwordRules.push(createNumberRule<UserRegisterData>('La contraseña debe contener al menos un número'))
    }

    // Combinar todas las reglas de contraseña si hay alguna
    if (passwordRules.length > 0) {
        const passwordValidator = combineRules<UserRegisterData>(passwordRules)
        // Insertar después del passwordLengthRule
        const passwordLengthIndex = baseRules.findIndex(rule =>
            (rule as any).field === 'password' &&
            (rule as any).validate.toString().includes('minLength')
        )

        if (passwordLengthIndex !== -1) {
            baseRules.splice(passwordLengthIndex + 1, 0, passwordValidator)
        } else {
            baseRules.push(passwordValidator)
        }
    }

    validator.addRules(baseRules)

    // Reglas personalizadas adicionales
    if (customRules.length > 0) {
        validator.addRules(customRules)
    }

    return validator
}

// Versión simplificada para casos específicos
export const createBasicRegisterValidator = (): FormValidator<UserRegisterData> => {
    const validator = new FormValidator<UserRegisterData>()

    validator.addRules([
        createRequiredRule('name', 'El nombre es requerido'),
        createRequiredRule('email', 'El email es requerido'),
        createEmailRule<UserRegisterData>('El email no es válido'),
        createRequiredRule('rut', 'El RUT es requerido'),
        createRutFormatRule('El formato del RUT no es válido'),
        createRequiredRule('carrera', 'La carrera es requerida'),
        createRequiredRule('password', 'La contraseña es requerida'),
        createPasswordLengthRule<UserRegisterData>(6, 'La contraseña debe tener al menos 6 caracteres'),
        createRequiredRule('confirmPassword', 'Confirma tu contraseña'),
        createConfirmPasswordRule('Las contraseñas no coinciden'),
        createRequiredRule('role', 'El rol es requerido')
    ])

    return validator
}