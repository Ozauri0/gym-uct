import { UserRegisterData } from '../types/auth'
import { ValidationRule, ValidationResult } from '../types/auth'

export class FormValidator {
    private rules: ValidationRule[] = []

    constructor(rules: ValidationRule[] = []) {
        this.rules = rules
    }

    // Método para agregar reglas (extensión)
    addRule(rule: ValidationRule): void {
        this.rules.push(rule)
    }

    // Método para agregar múltiples reglas
    addRules(rules: ValidationRule[]): void {
        this.rules.push(...rules)
    }

    // Método para validar
    validate(data: UserRegisterData): ValidationResult {
        const errors: Partial<UserRegisterData> = {}

        for (const rule of this.rules) {
            const errorMessage = rule.validate(data[rule.field], data)
            if (errorMessage) {
                errors[rule.field] = errorMessage
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        }
    }

    // Método para limpiar reglas
    clearRules(): void {
        this.rules = []
    }
}