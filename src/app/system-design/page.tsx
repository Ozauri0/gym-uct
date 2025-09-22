'use client'

import { Button, Badge } from '@/shared/ui'
import TestInputPage from './InputTest'
import TableTest from './TableTest'
import SelectTest from './SelectTest'

export default function TestButton() {
  return (
    <div>
      <div className="p-8">
        <Button variant="primary" onClick={() => console.log('Funciona!')}>
          Probar Botón
        </Button>

        <Button loading className="ml-4">
          Loading
        </Button>

        <Button variant="danger" onClick={() => console.log('Funciona!')}>
          Probar Botón
        </Button>

        <Button variant='danger' loading className="ml-4">
          Loading
        </Button>
      </div>
      <div className="p-8 space-y-4">
        {/* Variantes */}
        <div className="space-x-2">
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>

        {/* Tamaños */}
        <div className="space-x-2">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </div>

        {/* Redondeado */}
        <div className="space-x-2">
          <Badge rounded>Rounded</Badge>
          <Badge>Default</Badge>
        </div>

        {/* Interactivo */}
        <div className="space-x-2">
          <Badge interactive onClick={() => alert('Badge clickeado!')}>
            Click Me
          </Badge>
        </div>

        {/* Combinaciones */}
        <div className="space-x-2">
          <Badge variant="success" size="sm" rounded>
            Active
          </Badge>
          <Badge variant="danger" size="lg" interactive>
            Critical
          </Badge>
        </div>
      </div>
      <TestInputPage />
      <TableTest />
      <SelectTest />
    </div>

  )
}