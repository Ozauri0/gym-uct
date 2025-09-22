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

export interface ValidationRule<T> {
    field: keyof T
    validate: (value: any, formData?: T) => string | undefined
}

export interface ValidationResult<T> {
    isValid: boolean
    errors: Partial<T>
}

// Tipo para mapear field a mensajes de error
export type ErrorMap<T> = Partial<Record<keyof T, string>>

export interface UserLoginData {
    email: string
    password: string
    rememberMe?: boolean
}

export interface LoginFormProps {
    onSubmit: (data: UserLoginData) => void
    isLoading?: boolean
    errors?: Partial<UserLoginData & { general?: string }>
    onFieldChange?: (field: keyof UserLoginData) => void
}