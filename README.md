# 🏋️‍♂️ Sistema de Reservas - Gimnasio UCT

**Aplicación web moderna para la gestión de reservas del gimnasio de la Universidad Católica de Temuco**

## 📌 Descripción

Sistema completo de reservas que moderniza y optimiza la gestión del gimnasio universitario, permitiendo a los estudiantes reservar horarios, gestionar sus reservas y visualizar disponibilidad en tiempo real.

### ✨ Características Principales

- 📅 **Reservas inteligentes**: Hasta 2 reservas semanales de 1 hora cada una
- 👥 **Gestión de cupos**: Visualización en tiempo real de disponibilidad
- 🔄 **Flexibilidad**: Modificación (1 vez) o cancelación de reservas
- 👨‍💼 **Panel administrativo**: Control total de horarios, salas y usuarios
- 🔐 **Autenticación universitaria**: Login con credenciales institucionales

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- MongoDB 6+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/gym-uct.git
cd gym-uct

# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd api
npm install
```

### Configuración

Crear archivo `.env` en la carpeta `/api`:

```env
MONGO_URI=mongodb://localhost:27017/gym-uct
PORT=5000
NODE_ENV=development
```

### Ejecutar el Proyecto

**Backend (API):**
```bash
cd api
npm run dev  # Puerto 5000
```

**Frontend (Next.js):**
```bash
npm run dev  # Puerto 3000
```

Abrir [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **React Hooks** - Gestión de estado

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB

### Arquitectura
- **Clean Code** - Código limpio y mantenible
- **RESTful API** - Diseño de API estándar

## 📁 Estructura del Proyecto

```
gym-uct/
├── api/                    # Backend (Express + MongoDB)
│   ├── config/            # Configuración y conexión DB
│   ├── controllers/       # Controladores de rutas
│   ├── models/           # Modelos de Mongoose
│   ├── repositories/     # Capa de acceso a datos
│   ├── routes/           # Definición de endpoints
│   └── index.js          # Servidor Express
├── src/                   # Frontend (Next.js)
│   └── app/              # App Router de Next.js
├── public/               # Archivos estáticos
└── context.md           # Documentación del proyecto
```

## 📋 API Endpoints

### Usuarios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users` | Listar usuarios |
| GET | `/api/users/:id` | Obtener usuario |
| POST | `/api/users` | Crear usuario |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |

## 👤 Roles de Usuario

- **Alumno**: Reserva horas, consulta cupos, modifica/cancela reservas
- **Trabajador**: Visualiza información de reservas y apoya gestión
- **Administrador**: Control total del sistema

## 📊 Modelos de Datos

### User
- Información personal (nombre, email, RUT)
- Control de reservas (máx. 2 semanales)
- Estado y rol

### Reserva
- Vinculación usuario-sala
- Horario (60 minutos)
- Estados: reservada, cancelada, asistida
- Cambios permitidos: 1

### Sala
- Sectores: pesas, máquinas
- Capacidad y ubicación
- Estado activo/inactivo

---

**Puerto Frontend:** 3000 | **Puerto Backend:** 5000 | **Base de datos:** MongoDB
