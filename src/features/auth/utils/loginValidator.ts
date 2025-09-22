import { FormValidator } from './validator'
import { UserLoginData } from '../types/auth'
import {
    createRequiredRule,
    createEmailRule,
    createPasswordLengthRule,
    createUpperCaseRule,
    createDotRule,
    createSymbolRule,
    createNumberRule,
    combineRules
} from './rules/data'

// Factory para crear el validador de registro
export const createLogInValidator = (): FormValidator<UserLoginData> => {
    const validator = new FormValidator<UserLoginData>()
    
    const passwordValidator = combineRules<UserLoginData>([
        createPasswordLengthRule<UserLoginData>(8, 'La contraseña debe tener al menos 8 caracteres'),
        createUpperCaseRule<UserLoginData>('La contraseña debe contener al menos una letra mayúscula'),
        createDotRule<UserLoginData>('La contraseña debe contener al menos un punto'),
        createSymbolRule<UserLoginData>('La contraseña debe contener al menos un símbolo'),
        createNumberRule<UserLoginData>('La contraseña debe contener al menos un número')
    ])

    validator.addRules([
        createRequiredRule('email', 'El email es requerido'),
        createEmailRule<UserLoginData>('El email no es válido'),
        createRequiredRule('password', 'La contraseña es requerida'),
        passwordValidator,
    ])

    return validator
}
