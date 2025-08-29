import { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonBaseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
}

export interface ButtonProps extends ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  error?: boolean
}