'use client'

import React from 'react'
import { BadgeBaseProps } from './types'

export const BadgeBase: React.FC<BadgeBaseProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <span
      className={className}
      {...props}
    >
      {children}
    </span>
  )
}