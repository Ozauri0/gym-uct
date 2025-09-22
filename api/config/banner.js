const colors = require('colors');
const os = require('os');

/**
 * Obtiene la dirección IPv4 de la máquina
 * @returns {string} - Dirección IPv4 o 'No disponible' si no se encuentra
 */
const getIpAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Saltamos las interfaces que no sean IPv4 o que sean loopback (127.0.0.1)
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'No disponible';
};

/**
 * Muestra un banner informativo cuando se inicia la API
 * @param {object} config - Configuración de la API
 */
const showBanner = (config) => {
  const apiName = 'FIT UCT API REST';
  const version = 'v1.0.0';
  const line = '='.repeat(60);
  const ipAddress = getIpAddress();

  console.log(line.rainbow);
  console.log(
    `${colors.bold.cyan('║')} ${colors.bold.green(apiName.padEnd(30))} ${colors.yellow(version.padStart(25))} ${colors.bold.cyan('║')}`,
  );
  console.log(line.rainbow);

  console.log(`\n${colors.bold.yellow('📡 INFORMACIÓN DEL SERVIDOR')}`);
  console.log(`${colors.green('┃')} Estado: ${colors.bold.green('En línea')}`);
  console.log(`${colors.green('┃')} URL: ${colors.bold.cyan(`http://localhost:${config.PORT}`)}`);
  console.log(`${colors.green('┃')} Entorno: ${colors.bold.yellow(config.NODE_ENV)}`);
  console.log(`${colors.green('┃')} Fecha: ${colors.bold.cyan(new Date().toLocaleString())}`);

  console.log(`\n${colors.bold.yellow('🔌 ENDPOINTS DISPONIBLES')}`);
  console.log(
    `${colors.green('┃')} ${colors.bold.green('GET')}    ${colors.cyan('/')}                 → Verificar estado de la API`,
  );
  console.log(
    `${colors.green('┃')} ${colors.bold.green('GET')}    ${colors.cyan('/api/users')}        → Listar todos los usuarios`,
  );
  console.log(
    `${colors.green('┃')} ${colors.bold.green('GET')}    ${colors.cyan('/api/users/:id')}    → Obtener un usuario por ID`,
  );
  console.log(
    `${colors.green('┃')} ${colors.bold.green('POST')}   ${colors.cyan('/api/users')}        → Crear un nuevo usuario`,
  );
  console.log(
    `${colors.green('┃')} ${colors.bold.green('PUT')}    ${colors.cyan('/api/users/:id')}    → Actualizar un usuario existente`,
  );
  console.log(
    `${colors.green('┃')} ${colors.bold.green('DELETE')} ${colors.cyan('/api/users/:id')}    → Eliminar un usuario`,
  );

  console.log(`\n${colors.bold.yellow('💻 COMANDOS ÚTILES')}`);
  console.log(
    `${colors.green('┃')} ${colors.bold.cyan('npm run dev')}      → Iniciar servidor en modo desarrollo`,
  );
  console.log(
    `${colors.green('┃')} ${colors.bold.cyan('npm start')}        → Iniciar servidor en modo producción`,
  );

  console.log(`\n${colors.bold.cyan('🔍 LOGS DE ACTIVIDAD')}`);
  console.log(`${colors.blue('ℹ')} = Información`);
  console.log(`${colors.green('✓')} = Operación exitosa`);
  console.log(`${colors.yellow('⚠')} = Advertencia`);
  console.log(`${colors.red('✖')} = Error`);

  console.log(`\n${line.rainbow}`);

  // Añadir enlaces de acceso a la API (local y remoto)
  console.log(`\n${colors.bold.magenta('🌐 ACCESO A LA API')}`);
  console.log(
    `${colors.green('┃')} ${colors.bold.cyan('Local:')}    ${colors.bold.green(`http://localhost:${config.PORT}`)}`,
  );
  console.log(
    `${colors.green('┃')} ${colors.bold.cyan('Red local:')} ${colors.bold.green(`http://${ipAddress}:${config.PORT}`)}`,
  );
  console.log(`\n${line.rainbow}\n`);
};

module.exports = showBanner;
