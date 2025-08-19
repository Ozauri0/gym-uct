const mongoose = require('mongoose');
const config = require('./config');
const colors = require('colors');

const connectDB = async () => {
  try {
    console.log(`${colors.cyan('⟳')} Intentando conectar a MongoDB...`);
    
    const conn = await mongoose.connect(config.MONGO_URI);
    
    console.log(`
${colors.green('✓')} ${colors.bold.green('MongoDB conectado exitosamente')}
${colors.green('┃')} Servidor: ${colors.bold.cyan(conn.connection.host)}
${colors.green('┃')} Base de datos: ${colors.bold.yellow(conn.connection.name)}
${colors.green('┃')} Puerto: ${colors.bold.magenta(conn.connection.port || '27017')}
    `);
  } catch (error) {
    console.error(`${colors.red('✖ ERROR DE CONEXIÓN:')} ${error.message}`.bold);
    console.error(`${colors.yellow('⚠')} Verifique que MongoDB esté en ejecución y que la URI sea correcta`);
    process.exit(1);
  }
};

module.exports = connectDB;