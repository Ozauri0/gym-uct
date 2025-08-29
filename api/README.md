# 🏋️ API Gym UCT

API REST para el sistema de reservas del gimnasio de la Universidad Católica de Temuco.

## 🚀 Inicio Rápido

### Instalación
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env en la raíz de /api con:
# MONGO_URI=mongodb://localhost:27017/gym-uct
# PORT=5000
# NODE_ENV=development
```

### Ejecutar el servidor
```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

## 📋 Rutas Disponibles

### Usuarios
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users` | Obtener todos los usuarios |
| GET | `/api/users/:id` | Obtener usuario por ID |
| POST | `/api/users` | Crear nuevo usuario |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |


## 🧪 Testing

### Probar los repositorios
```bash
# Ejecutar pruebas automáticas de repositorios
node test-repositories.js
```

## 📁 Estructura del Proyecto

```
api/
├── config/          # Configuración (DB, variables)
├── controllers/     # Lógica de controladores
├── models/          # Modelos de Mongoose
├── repositories/    # Capa de acceso a datos
├── routes/          # Definición de rutas
├── index.js         # Punto de entrada
└── test-repositories.js  # Script de pruebas
```

## 🗃️ Modelos de Datos

### User
- `name` - Nombre completo
- `email` - Email institucional (único)
- `rut` - RUT chileno (opcional)
- `role` - Rol: alumno, trabajador, administrador
- `carrera` - Carrera universitaria
- `activo` - Estado activo/inactivo
- `reservasSemanales` - Contador de reservas (máx 2)

### Reserva
- `usuario` - Referencia al usuario
- `sala` - Referencia a la sala
- `inicio` - Fecha/hora de inicio
- `fin` - Fecha/hora de término (60 min)
- `estado` - reservada, cancelada, asistida
- `cambiosRestantes` - Cambios permitidos (máx 1)

### Sala
- `nombre` - Nombre de la sala (único)
- `sector` - pesas o maquinas
- `capacidad` - Capacidad máxima
- `ubicacion` - Ubicación física
- `activa` - Estado activo/inactivo

## 🛠️ Tecnologías

- **Node.js** - Runtime
- **Express** - Framework web
- **MongoDB** - Base de datos
- **Mongoose** - ODM para MongoDB
- **Colors** - Logs con colores
- **Nodemon** - Auto-reload en desarrollo

## 📝 Notas de Desarrollo

- Los repositorios encapsulan el acceso a datos
- Usar el patrón Repository para todas las operaciones de BD
- Los controladores no deben acceder directamente a los modelos
- Validaciones en modelos (Mongoose) y lógica de negocio en servicios
