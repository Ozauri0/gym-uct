import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  // Configuración para Docker build
  eslint: {
    ignoreDuringBuilds: true, // Deshabilitar ESLint durante el build de Docker
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
