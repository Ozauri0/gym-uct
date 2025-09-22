import React from 'react'

export const ButtonLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div 
        className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"
        aria-hidden="true"
      />
      Cargando...
    </div>
  )
}