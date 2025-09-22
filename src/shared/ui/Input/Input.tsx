'use client'

import React from 'react'
import { InputProps } from './types'
import { InputStyleBuilder } from './styles/InputStyles'
import { InputBase } from './InputBase'
import { InputLabel } from './InputLabel'
import { InputError } from './InputError'
import { INPUT_DEFAULT_VALUES, INPUT_TEST_IDS } from './constants'

export const Input: React.FC<InputProps> = ({
  variant = INPUT_DEFAULT_VALUES.variant,
  size = INPUT_DEFAULT_VALUES.size,
  label,
  error,
  helperText,
  fullWidth = INPUT_DEFAULT_VALUES.fullWidth,
  leftIcon,
  rightIcon,
  containerClassName = '',
  className = '',
  disabled = INPUT_DEFAULT_VALUES.disabled,
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  const inputVariant = error ? 'error' : disabled ? 'disabled' : variant

  const inputStyles = InputStyleBuilder.buildInputStyles(
    inputVariant,
    size,
    disabled,
    !!leftIcon,
    !!rightIcon
  )

  const combinedInputClassName = `${inputStyles} ${className}`.trim()

  return (
    <div 
      className={`space-y-1 ${fullWidth ? 'w-full' : ''} ${containerClassName}`}
      data-testid={INPUT_TEST_IDS.container}
    >
      {label && (
        <InputLabel 
          htmlFor={inputId} 
          required={props.required}
          data-testid={INPUT_TEST_IDS.label}
        >
          {label}
        </InputLabel>
      )}

      <div className="relative">
        {leftIcon && (
          <div 
            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            data-testid={INPUT_TEST_IDS.leftIcon}
          >
            {leftIcon}
          </div>
        )}

        <InputBase
          id={inputId}
          className={combinedInputClassName}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          data-testid={INPUT_TEST_IDS.base}
          {...props}
        />

        {rightIcon && (
          <div 
            className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
            data-testid={INPUT_TEST_IDS.rightIcon}
          >
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <InputError 
          message={error} 
          id={`${inputId}-error`}
          data-testid={INPUT_TEST_IDS.error}
        />
      )}

      {helperText && !error && (
        <p 
          className="text-sm text-gray-500"
          data-testid={INPUT_TEST_IDS.helper}
        >
          {helperText}
        </p>
      )}
    </div>
  )
}