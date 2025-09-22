'use client'

import { LoginForm } from '@/features/auth/components/LoginForm'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const { isLoading, errors, handleLogin } = useLogin()

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo */}
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">✓</span>
                    </div>
                </div>

                {/* Título */}
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Iniciar sesión
                </h2>

                {/* Subtítulo */}
                <p className="mt-2 text-center text-sm text-gray-600">
                    O{' '}
                    <Link
                        href="/auth/registro"
                        className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                    >
                        crea una cuenta nueva
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-6 px-4 shadow rounded-lg sm:px-8">

                    <LoginForm onSubmit={handleLogin} isLoading={isLoading} errors={errors} />

                </div>
            </div>
        </div>
    )
}