export interface UserRegisterData {
    name: string
    email: string
    rut: string
    carrera: string
    password: string
    confirmPassword: string
    role: string
}

export interface RegisterFormProps {
    onSubmit: (data: UserRegisterData) => void
    isLoading?: boolean
    errors?: Partial<UserRegisterData>
    onFieldChange?: (field: keyof UserRegisterData) => void
}

export interface ValidationRule {
    field: keyof UserRegisterData
    validate: (value: any, formData?: UserRegisterData) => string | undefined
}

export interface ValidationResult {
    isValid: boolean
    errors: Partial<UserRegisterData>
}