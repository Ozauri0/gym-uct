import { ReactNode, Dispatch, SetStateAction } from 'react'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectGroup {
  label: string
  options: SelectOption[]
}

export type SelectValue = string | string[]

// Actualizar la interfaz SelectProps para hacer onChange más flexible
export interface SelectProps {
  value?: SelectValue
  onChange?: (value: SelectValue) => void
  options: (SelectOption | SelectGroup)[]
  placeholder?: string
  disabled?: boolean
  error?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  multiple?: boolean
  label?: string
  helperText?: string
}