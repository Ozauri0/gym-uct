const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const config = require('./config/config');
const colors = require('colors');
const showBanner = require('./config/banner');

// Importar middlewares
const { 
  helmet, 
  cors, 
  logger, 
  validateJSON, 
  errorHandler, 
  notFoundHandler 
} = require('./middlewares');

// Configuración de colores
colors.enable();
colors.setTheme({
  info: 'blue',
  success: 'green',
  warn: 'yellow',
  error: 'red',
  highlight: 'cyan'
});

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();
const PORT = config.PORT;

// Middlewares de seguridad
app.use(helmet());
app.use(cors);

// Middleware para parsing JSON con validación
app.use(express.json());
app.use(validateJSON);
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use(logger);

// Importar rutas
const userRoutes = require('./routes/users');

// Ruta base para verificar que la API está funcionando
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: '¡API funcionando correctamente!',
    version: '1.0.0',
    endpoints: {
      users: '/api/users'
    }
  });
});

// Usar rutas
app.use('/api/users', userRoutes);

// Manejo de rutas no encontradas (debe ir después de todas las rutas)
app.use(notFoundHandler);

// Manejo de errores (debe ser el último middleware)
app.use(errorHandler);

// Iniciar el servidor
app.listen(PORT, () => {
  // Mostrar banner informativo
  showBanner(config);
});

module.exports = app;