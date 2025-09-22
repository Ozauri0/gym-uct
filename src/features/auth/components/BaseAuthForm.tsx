'use client'

import { ReactNode } from 'react'
import { Button } from '@/shared/ui/Button'

interface BaseAuthFormProps {
    onSubmit: (e: React.FormEvent) => void
    isLoading?: boolean
    submitText: string
    children: ReactNode
}

export const BaseAuthForm: React.FC<BaseAuthFormProps> = ({
    onSubmit,
    isLoading,
    submitText,
    children
}) => {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {children}
            <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
            >
                {isLoading ? 'Procesando...' : submitText}
            </Button>
        </form>
    )
}