# Sistema de diseño

El propósito de esta tarea es generar un sistema de diseño básico que implemente componentes visuales que se suelen utilizar de manera común.

## Estructura de carpetas

El frontend se utiliza una arquitectura modular basada en features (características) que en resumidas cuentas permite mantener:

* Escalabilidad: nuevas características se agregan sin afectar a las demás
* Mantenibilidad: el código es organizado por dominio de negocio
* Reutilización: Componentes UI aislados y lógica reutilizable.

```text
src/
├── app/                    # Capa de aplicación/configuración
├── features/              # Módulos de negocio (por feature)
│   ├── admin/            # Feature de administración
│   ├── auth/             # Feature de autenticación  
│   └── reservas/         # Feature de reservas
│        ├── components/           # Componentes compartidos
│        ├── hooks/               # Hooks personalizados
│        ├── types/               # Definiciones TypeScript
│        ├── utils/               # Utilidades y helpers
│        ├── index.ts             # Barrel file de reservas
└── shared/              # Recursos completamente compartidos
    ├── hooks/           # Hooks compartidos
    └── ui/              # Componentes UI compartidos
        ├── Badge/       # Componente Badge
        ├── Button/      # Componente Button
        ├── Input/       # Componente Input
        ├── Select/      # Componente Select
        ├── Table/       # Componente Table
        └── index.ts     # Barrel file de UI
```

## Principios utilizados

Tomando en consideración el componente UI Badge. Podemos visualizar una separación de módulos. Por ejemplo: (Responsabilidad Única)
* BadgeStyles es el responsable único de definir los estilos del componente base. 
* Variants.ts define las variaciones de estilos según el nombre de clase.
* Badge.tsx es responsable de la lógica del componente
* BadgeBase.tsx es responsable de la implementación base
* types.ts define los tipos de datos
* index.ts es responsable de exportar todo como una única exportación

```text
Badge/
├── styles/               # Carpeta de estilos
│   ├── BadgeStyles.ts   # Estilos principales
│   └── variants.ts      # Variantes de estilos
├── Badge.tsx            # Componente principal
├── BadgeBase.tsx        # Componente base
├── index.ts             # Barrel file (punto de entrada)
└── types.ts             # Definiciones TypeScript
```

variants.ts hace uso del principio OCP. Es decir, está abierto a extensiones pero cerrado a modificaciones.

```ts
import { BadgeVariant, BadgeSize } from '../types'

export const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  primary: 'bg-blue-100 text-blue-800 border-blue-200',
  secondary: 'bg-gray-100 text-gray-800 border-gray-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  outline: 'bg-transparent text-gray-700 border-gray-300',
}

export const BADGE_SIZES: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}
```

El componente Badge sigue el principio de sustitución de Liskov, dónde el componente BadgeBase cuenta con la funcionalidad mínima. Mientras que el componente Badge extiende su funcionalidad.

```ts
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
```

```ts
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
```

La presencia del principio de segregación de interfaces se justifica en el archivo types.ts, dónde los consumidores solo dependen de las interfaces que necesitan.

```ts
export interface BadgeBaseProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
}

export interface BadgeProps extends BadgeBaseProps {
  variant?: BadgeVariant
  size?: BadgeSize
  rounded?: boolean
  interactive?: boolean
}
```

En Badge.tsx, se puede visualizar el principio de de inversión de dependencias, dónde se puede visualizar que el componente Badge no depende de implementaciones concretas de estilos.

```ts
import { BadgeProps } from './types'
```