export interface UserRegisterData {
    name: string
    email: string
    password: string
    confirmPassword: string
    role?: string
    rut: string
    carrera: string
}

export interface RegisterFormProps {
    onSubmit: (data: UserRegisterData) => void
    isLoading?: boolean
}