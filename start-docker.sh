#!/bin/bash

echo "🐳 Iniciando la aplicación Gym UCT con Docker..."

# Verificar si existe el archivo .env, si no, copiarlo desde .env.example
if [ ! -f .env ]; then
    echo "📋 Copiando archivo de configuración de ejemplo..."
    cp .env.example .env
    echo "✅ Archivo .env creado. Puedes editarlo para cambiar los puertos y configuraciones."
fi

# Construir e iniciar los contenedores
echo "🔨 Construyendo e iniciando los contenedores..."
docker-compose up --build -d

# Mostrar el estado de los contenedores
echo "📊 Estado de los contenedores:"
docker-compose ps

echo ""
echo "✅ ¡Aplicación iniciada exitosamente!"
echo ""
echo "🌐 URLs de acceso:"
echo "   Frontend: http://localhost:${FRONTEND_PORT:-3000}"
echo "   Backend API: http://localhost:${BACKEND_PORT:-3001}"
echo "   MongoDB: localhost:${MONGO_PORT:-27017}"
echo ""
echo "🔧 Para detener la aplicación: docker-compose down"
echo "🔧 Para ver logs: docker-compose logs -f"
echo "🔧 Para reiniciar: docker-compose restart"
