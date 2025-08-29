import { HTMLAttributes, ReactNode } from 'react'

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline'
export type BadgeSize = 'sm' | 'md' | 'lg'

export interface BadgeBaseProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
}

export interface BadgeProps extends BadgeBaseProps {
  variant?: BadgeVariant
  size?: BadgeSize
  rounded?: boolean
  interactive?: boolean
}