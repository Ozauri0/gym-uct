'use client'

import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { useRegister } from '@/features/auth/hooks/useRegister'

export default function RegisterPage() {
    const { isLoading, handleRegister, errors } = useRegister()

    const handleSubmit = (data: any) => {
        handleRegister(data)
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    {/* Logo de tu aplicación */}
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">A</span>
                    </div>
                </div>

                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Crear cuenta
                </h2>

                <p className="mt-2 text-center text-sm text-gray-600">
                    O{' '}
                    <a
                        href="/auth/login"
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        inicia sesión en tu cuenta existente
                    </a>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} errors={errors} />
                </div>
            </div>
        </div>
    )
}