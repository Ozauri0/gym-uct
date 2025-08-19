// Configuración global de la aplicación
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3001,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/fit-uct-db',
  JWT_SECRET: process.env.JWT_SECRET || 'secretkey_desarrollo',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d'
};