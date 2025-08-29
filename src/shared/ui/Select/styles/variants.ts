export const SELECT_SIZES = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-5 text-lg',
}

export const SELECT_TRIGGER_SIZES = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
}

export const SELECT_DEFAULT_VALUES = {
    size: 'md' as const,
    disabled: false,
    multiple: false,
    placeholder: 'Seleccionar...',
}

export const SELECT_STYLES = {
    base: 'w-full border rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    normal: 'bg-white border-gray-300 text-gray-900',
    error: 'border-red-500 focus:ring-red-500 focus:border-red-500',
    disabled: 'bg-gray-100 text-gray-500 cursor-not-allowed',
}