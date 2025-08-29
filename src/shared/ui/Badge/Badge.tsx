'use client'

import React from 'react'
import { BadgeProps } from './types'
import { BadgeStyleBuilder } from './styles/BadgeStyles'
import { BadgeBase } from './BadgeBase'

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  size = 'md',
  rounded = false,
  interactive = false,
  className = '',
  children,
  ...props
}) => {
  const badgeStyles = BadgeStyleBuilder.buildStyles(
    variant,
    size,
    rounded,
    interactive
  )

  const combinedClassName = `${badgeStyles} ${className}`.trim()

  return (
    <BadgeBase
      className={combinedClassName}
      {...props}
    >
      {children}
    </BadgeBase>
  )
}