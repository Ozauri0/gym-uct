'use client'

import React from 'react'
import { ButtonProps } from './types'
import { ButtonStyleBuilder } from './styles/ButtonStyles'
import { ButtonBase } from './ButtonBase'
import { ButtonLoader } from './ButtonLoader'

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  error = false,
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const buttonStyles = ButtonStyleBuilder.buildStyles(
    variant,
    size,
    error,
    disabled,
    loading,
    fullWidth
  )

  const combinedClassName = `${buttonStyles} ${className}`.trim()

  return (
    <ButtonBase
      loading={loading}
      disabled={disabled}
      fullWidth={fullWidth}
      className={combinedClassName}
      {...props}
    >
      {loading ? <ButtonLoader /> : children}
    </ButtonBase>
  )
}