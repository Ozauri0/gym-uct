const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const config = require('./config/config');
const colors = require('colors');
const showBanner = require('./config/banner');

// Configuración de colores
colors.enable();
colors.setTheme({
  info: 'blue',
  success: 'green',
  warn: 'yellow',
  error: 'red',
  highlight: 'cyan',
});

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

const app = express();
const PORT = config.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req, res, next) => {
  console.log(
    `${colors.yellow('➤')} ${colors.cyan(new Date().toISOString())} ${colors.green(req.method)} ${colors.yellow(req.url)}`,
  );
  next();
});

// Importar rutas
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Ruta base para verificar que la API está funcionando
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '¡API funcionando correctamente!',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      auth: '/api/auth',
    },
  });
});

// Usar rutas
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(`${colors.red('✖ ERROR:')} ${err.stack}`);
  res.status(500).json({
    success: false,
    message: 'Error en el servidor',
    error: config.NODE_ENV === 'development' ? err.message : {},
  });
});

// 404 - Ruta no encontrada
app.use((req, res) => {
  console.log(`${colors.yellow('⚠')} Ruta no encontrada: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`,
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  // Mostrar banner informativo
  showBanner(config);
});

module.exports = app;
