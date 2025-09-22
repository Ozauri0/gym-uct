import { ValidationRule, ValidationResult } from '../types/auth'

// Principio de Responsabilidad Única (SRP)
// Esta clase solo se encarga de validar datos basados en reglas
export class FormValidator<T extends object> {
    private rules: ValidationRule<T>[] = []

    // Principio de Inversión de Dependencias (DIP)
    // Dependemos de abstracciones (ValidationRule) no de implementaciones concretas
    constructor(rules: ValidationRule<T>[] = []) {
        this.rules = rules
    }

    // Principio Abierto/Cerrado (OCP)
    // Abierto para extensión (puedes agregar nuevas reglas)
    // Cerrado para modificación (no necesitas modificar la clase para agregar reglas)
    addRule(rule: ValidationRule<T>): void {
        this.rules.push(rule)
    }

    addRules(rules: ValidationRule<T>[]): void {
        this.rules.push(...rules)
    }

    // Principio de Sustitución de Liskov (LSP)
    // El método validate siempre devuelve un ValidationResult consistente
    validate(data: T): ValidationResult<T> {
        const errors: Partial<T> = {}

        for (const rule of this.rules) {
            const errorMessage = rule.validate(data[rule.field], data)
            if (errorMessage) {
                errors[rule.field] = errorMessage as any
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        }
    }

    clearRules(): void {
        this.rules = []
    }

    // Método helper para validación individual de campos
    validateField(field: keyof T, value: any, formData: T): string | undefined {
        const fieldRules = this.rules.filter(rule => rule.field === field)

        for (const rule of fieldRules) {
            const error = rule.validate(value, formData)
            if (error) return error
        }

        return undefined
    }

    // Método para obtener todas las reglas de un campo específico
    getFieldRules(field: keyof T): ValidationRule<T>[] {
        return this.rules.filter(rule => rule.field === field)
    }
}