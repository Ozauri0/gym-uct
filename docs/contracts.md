# Contrato de API - Gym UCT

## Base de la API

- **Local:** `http://localhost:4000/api`
- **Producción:** `https://api.gym-uct.cl/api` (por definir)

## Autenticación

- Se utiliza JWT en el header:
  ```
  Authorization: Bearer <token>
  ```
---

## Endpoints

### Autenticación

#### POST `/auth/login`

Autentica un usuario y retorna un token JWT.

**Request**
```json
{
  "username": "patricio.valdes",
  "password": "Password123"
}
```

**Response (200 OK)**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "66d4a8b1c8e74f001f8e39d2",
      "name": "Patricio Valdés",
      "username": "patricio.valdes",
      "email": "patricio@uct.cl",
      "role": "admin",
      "lastLogin": "2024-01-15T10:30:00.000Z"
    }
  },
  "timestamp": "2024-01-15T10:30:15.123Z"
}
```

**Response (400 Bad Request)**
```json
{
  "success": false,
  "message": "Por favor ingresa username y password",
  "timestamp": "2024-01-15T10:30:15.123Z"
}
```

**Response (401 Unauthorized)**
```json
{
  "success": false,
  "message": "Credenciales inválidas",
  "timestamp": "2024-01-15T10:30:15.123Z"
}
```

---

#### GET `/auth/me`

Obtiene la información del usuario autenticado.

**Headers**
```
Authorization: Bearer <token>
```

**Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "_id": "66d4a8b1c8e74f001f8e39d2",
    "name": "Patricio Valdés",
    "username": "patricio.valdes",
    "email": "patricio@uct.cl",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-01-10T08:00:00.000Z",
    "lastLogin": "2024-01-15T10:30:00.000Z",
    "__v": 0
  },
  "timestamp": "2024-01-15T10:35:22.456Z"
}
```

**Response (401 Unauthorized)**
```json
{
  "success": false,
  "message": "Acceso denegado. Token requerido.",
  "timestamp": "2024-01-15T10:35:22.456Z"
}
```

---

### Reservas

#### GET `/reservas`

Obtiene todas las reservas (requiere autenticación).

**Headers**
```
Authorization: Bearer <token>
```

**Response (200 OK)**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "66d4a8b1c8e74f001f8e39d3",
      "userId": "66d4a8b1c8e74f001f8e39d2",
      "salaId": "66d4a8b1c8e74f001f8e39d4",
      "fecha": "2024-01-16",
      "horaInicio": "09:00",
      "horaFin": "10:00",
      "estado": "confirmada",
      "createdAt": "2024-01-15T09:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-15T10:40:30.789Z"
}
```

---

#### POST `/reservas`

Crea una nueva reserva (requiere autenticación).

**Headers**
```
Authorization: Bearer <token>
```

**Request**
```json
{
  "salaId": "66d4a8b1c8e74f001f8e39d4",
  "fecha": "2024-01-16",
  "horaInicio": "09:00",
  "horaFin": "10:00"
}
```

**Response (201 Created)**
```json
{
  "success": true,
  "message": "Reserva creada exitosamente",
  "data": {
    "_id": "66d4a8b1c8e74f001f8e39d5",
    "userId": "66d4a8b1c8e74f001f8e39d2",
    "salaId": "66d4a8b1c8e74f001f8e39d4",
    "fecha": "2024-01-16",
    "horaInicio": "09:00",
    "horaFin": "10:00",
    "estado": "pendiente",
    "createdAt": "2024-01-15T11:00:00.000Z"
  },
  "timestamp": "2024-01-15T11:00:15.123Z"
}
```

---

### Salas

#### GET `/salas`

Obtiene todas las salas disponibles.

**Response (200 OK)**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "66d4a8b1c8e74f001f8e39d4",
      "nombre": "Sala de Pesas",
      "capacidad": 20,
      "equipamiento": ["mancuernas", "barras", "discos"],
      "horario": {
        "apertura": "06:00",
        "cierre": "22:00"
      },
      "estado": "disponible"
    }
  ],
  "timestamp": "2024-01-15T10:45:45.321Z"
}
```

---

## Códigos de Estado HTTP

| Código | Descripción                                      |
|--------|--------------------------------------------------|
| 200    | OK - Solicitud exitosa                           |
| 201    | Created - Recurso creado exitosamente            |
| 400    | Bad Request - Datos de entrada inválidos         |
| 401    | Unauthorized - Autenticación requerida o inválida|
| 403    | Forbidden - Permisos insuficientes               |
| 404    | Not Found - Recurso no encontrado                |
| 500    | Internal Server Error - Error del servidor       |