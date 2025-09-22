# Arquitectura Hexagonal - Sistema de Autenticación

Este módulo implementa un sistema de autenticación completo siguiendo los principios de **Arquitectura Hexagonal** (Ports and Adapters) y **Código Limpio**.

## 🏗️ Estructura de la Arquitectura

```
src/
├── domain/                    # Capa de Dominio (Core Business Logic)
│   ├── entities/             # Entidades de negocio
│   │   └── User.js
│   ├── value-objects/        # Objetos de valor inmutables
│   │   ├── Email.js
│   │   └── HashedPassword.js
│   └── ports/               # Interfaces (contratos)
│       ├── UserRepository.js
│       ├── TokenRepository.js
│       ├── Hasher.js
│       ├── TokenService.js
│       └── Clock.js
├── application/              # Capa de Aplicación (Use Cases)
│   ├── use-cases/           # Casos de uso del sistema
│   │   ├── RegisterUser.js
│   │   ├── AuthenticateUser.js
│   │   ├── RefreshSession.js
│   │   ├── Logout.js
│   │   ├── RequestPasswordReset.js
│   │   └── ResetPassword.js
│   └── policies/            # Políticas de negocio
│       ├── PasswordPolicy.js
│       └── SecurityPolicy.js
└── infrastructure/          # Capa de Infraestructura (Adaptadores)
    └── adapters/            # Implementaciones concretas
        ├── SystemClock.js
        ├── BcryptHasher.js
        └── JwtTokenService.js

tests/                       # Tests unitarios y de integración
├── domain/                  # Tests del dominio
├── application/             # Tests de casos de uso
└── mocks/                   # Mocks para testing
```

## 🎯 Principios Aplicados

### Arquitectura Hexagonal
- **Dominio**: Lógica de negocio pura, sin dependencias externas
- **Aplicación**: Casos de uso que orquestan el dominio
- **Infraestructura**: Adaptadores que implementan los ports

### Principios SOLID
- **S**: Cada clase tiene una única responsabilidad
- **O**: Extensible sin modificar código existente
- **L**: Los adaptadores pueden reemplazarse sin cambiar contratos
- **I**: Interfaces específicas y cohesivas
- **D**: Dependencias por abstracción, no por implementaciones concretas

### Código Limpio
- Nombres descriptivos y expresivos
- Funciones pequeñas con responsabilidad única
- Sin comentarios innecesarios (código auto-documentado)
- Manejo consistente de errores

## 🚀 Casos de Uso Implementados

### RegisterUser
```javascript
const result = await registerUser.execute({
  email: 'usuario@uct.cl',
  password: 'SecurePass123!',
  name: 'Juan Pérez',
  role: 'alumno'
});
```

### AuthenticateUser
```javascript
const result = await authenticateUser.execute({
  email: 'usuario@uct.cl',
  password: 'SecurePass123!'
});
// Retorna: { tokens: { accessToken, refreshToken }, user: {...} }
```

### RefreshSession
```javascript
const result = await refreshSession.execute({
  refreshToken: 'refresh_token_here'
});
// Retorna nuevos tokens
```

### Logout
```javascript
const result = await logout.execute({
  userId: 'user_id',
  refreshToken: 'refresh_token',
  logoutAllDevices: false
});
```

## 🔐 Políticas de Seguridad

### PasswordPolicy
- Mínimo 8 caracteres
- Al menos 1 mayúscula, 1 minúscula, 1 número, 1 carácter especial
- Detección de patrones débiles comunes

### SecurityPolicy
- Máximo 5 intentos de login
- Bloqueo de 15 minutos tras fallos
- Refresh tokens válidos por 7 días
- Rotación obligatoria de refresh tokens
- Access tokens válidos por 15 minutos

## 🧪 Testing

### Ejecutar Tests
```bash
# Todos los tests
npm test

# Solo tests de dominio
npm run test:domain

# Solo tests de aplicación
npm run test:application

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### Estrategia de Testing
- **Unit Tests**: Para entidades, value objects y casos de uso
- **Mocks**: Repositorios y servicios en memoria para testing
- **Aislamiento**: Cada test es independiente
- **Coverage**: Objetivo de 90%+ de cobertura

## 🔧 Configuración e Integración

### Instalar Dependencias
```bash
npm install bcrypt jsonwebtoken
npm install --save-dev jest nodemon
```

### Ejemplo de Integración
```javascript
const {
  useCases: { RegisterUser, AuthenticateUser },
  adapters: { SystemClock, BcryptHasher, JwtTokenService }
} = require('./src');

// Configurar adaptadores
const clock = new SystemClock();
const hasher = new BcryptHasher(12);
const tokenService = new JwtTokenService({
  accessTokenSecret: process.env.JWT_ACCESS_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET
});

// Configurar casos de uso
const registerUser = new RegisterUser({
  userRepository: yourUserRepository,
  hasher,
  clock
});
```

## 📋 Próximos Pasos

1. **Implementar adaptadores de persistencia** (MongoDB, PostgreSQL)
2. **Crear endpoints HTTP** usando Express.js
3. **Añadir logging y métricas**
4. **Implementar rate limiting**
5. **Añadir validación de entrada a nivel HTTP**
6. **Configurar CI/CD pipeline**

## 🤝 Beneficios de esta Arquitectura

- **Testeable**: Fácil testing con mocks
- **Mantenible**: Separación clara de responsabilidades
- **Flexible**: Fácil cambio de bases de datos, frameworks, etc.
- **Escalable**: Nuevos casos de uso se integran fácilmente
- **Independiente**: El dominio no depende de frameworks
- **Seguro**: Políticas de seguridad bien definidas

Esta implementación sigue las mejores prácticas de la industria y está lista para un entorno de producción.
