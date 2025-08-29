import { InputHTMLAttributes, ReactNode } from 'react'

export type InputVariant = 'primary' | 'secondary' | 'success' | 'error' | 'disabled'
export type InputSize = 'sm' | 'md' | 'lg'

export interface InputBaseProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    id?: string
}

export interface InputProps extends InputBaseProps {
    variant?: InputVariant
    size?: InputSize // Nuestra prop size personalizada
    label?: string
    error?: string
    helperText?: string
    fullWidth?: boolean
    leftIcon?: ReactNode
    rightIcon?: ReactNode
    containerClassName?: string
}