const helmet = require("helmet");
const cors = require("cors");
const colors = require('colors');

// Configuración de colores
colors.enable();
colors.setTheme({
  info: 'blue',
  success: 'green',
  warn: 'yellow',
  error: 'red',
  highlight: 'cyan'
});

// Configuración de CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Logger mejorado
const logger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? 'error' : 'success';
    
    console.log(
      `${colors.yellow('➤')} ${colors.cyan(new Date().toISOString())} ` +
      `${colors.green(req.method)} ${colors.yellow(req.url)} ` +
      `${colors[statusColor](res.statusCode)} - ${duration}ms`
    );
  });
  
  next();
};

// Middleware para validar JSON
const validateJSON = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.log(`${colors.yellow('⚠')} JSON malformado en la petición: ${req.url}`);
    return res.status(400).json({
      success: false,
      message: "JSON malformado en la petición"
    });
  }
  next();
};

// Manejo de errores centralizado
const errorHandler = (err, req, res, next) => {
  console.error(`${colors.red('✖ ERROR:')} ${err.stack}`);
  
  // Errores de validación
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      success: false,
      message: "Error de validación",
      errors: err.details || err.message
    });
  }
  
  // Errores de autenticación/autorización
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: "No autorizado"
    });
  }
  
  // Error por defecto
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: "Error en el servidor",
    error: process.env.NODE_ENV === "development" ? {
      message: err.message,
      stack: err.stack
    } : {}
  });
};

// Manejador de rutas no encontradas
const notFoundHandler = (req, res) => {
  console.log(`${colors.yellow('⚠')} Ruta no encontrada: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = {
  helmet,
  cors: cors(corsOptions),
  logger,
  validateJSON,
  errorHandler,
  notFoundHandler
};