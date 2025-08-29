/**
 * Script de prueba para los repositorios
 * Ejecutar con: node test-repositories.js
 */

const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/database');

// Cargar variables de entorno
dotenv.config();

// Importar repositorios
const { UserRepo, ReservaRepo, SalaRepo } = require('./repositories');

// Función auxiliar para imprimir resultados
const log = {
  title: (text) => console.log(`\n${colors.bold.cyan('═══ ' + text + ' ═══')}`),
  success: (text) => console.log(`${colors.green('✓')} ${text}`),
  error: (text) => console.log(`${colors.red('✖')} ${text}`),
  info: (text) => console.log(`${colors.yellow('→')} ${text}`),
  data: (obj) => console.log(colors.gray(JSON.stringify(obj, null, 2)))
};

// Tests principales
async function testUserRepo() {
  log.title('PROBANDO UserRepo');
  
  try {
    // 1. Crear un usuario de prueba
    log.info('Creando usuario de prueba...');
    const nuevoUsuario = await UserRepo.create({
      name: 'Test Usuario',
      email: `test${Date.now()}@uct.cl`,
      rut: '12345678-9',
      role: 'alumno',
      carrera: 'Ingeniería Informática'
    });
    log.success('Usuario creado exitosamente');
    log.data({ id: nuevoUsuario._id, name: nuevoUsuario.name, email: nuevoUsuario.email });
    
    // 2. Buscar por ID
    log.info('Buscando usuario por ID...');
    const usuarioPorId = await UserRepo.findById(nuevoUsuario._id);
    log.success(`Usuario encontrado: ${usuarioPorId.name}`);
    
    // 3. Buscar por email
    log.info('Buscando usuario por email...');
    const usuarioPorEmail = await UserRepo.findByEmail(nuevoUsuario.email);
    log.success(`Usuario encontrado por email: ${usuarioPorEmail.name}`);
    
    // 4. Actualizar usuario
    log.info('Actualizando usuario...');
    const usuarioActualizado = await UserRepo.update(nuevoUsuario._id, {
      carrera: 'Ingeniería Civil'
    });
    log.success(`Carrera actualizada a: ${usuarioActualizado.carrera}`);
    
    // 5. Buscar usuarios activos
    log.info('Buscando usuarios activos...');
    const usuariosActivos = await UserRepo.findActivos({ limit: 5 });
    log.success(`Se encontraron ${usuariosActivos.length} usuarios activos`);
    
    // 6. Buscar con opciones avanzadas
    log.info('Buscando con opciones avanzadas (select, sort, limit)...');
    const usuariosLimitados = await UserRepo.find(
      { role: 'alumno' },
      { 
        select: 'name email role',
        sort: { createdAt: -1 },
        limit: 3,
        lean: true // Retorna objetos JS planos (más rápido)
      }
    );
    log.success(`Encontrados ${usuariosLimitados.length} alumnos (máx 3)`);
    usuariosLimitados.forEach(u => log.data({ name: u.name, email: u.email }));
    
    // 7. Eliminar usuario de prueba
    log.info('Eliminando usuario de prueba...');
    await UserRepo.delete(nuevoUsuario._id);
    log.success('Usuario eliminado exitosamente');
    
  } catch (error) {
    log.error(`Error en UserRepo: ${error.message}`);
  }
}

async function testSalaRepo() {
  log.title('PROBANDO SalaRepo');
  
  try {
    // 1. Crear sala de prueba
    log.info('Creando sala de prueba...');
    const nuevaSala = await SalaRepo.create({
      nombre: `Sala Test ${Date.now()}`,
      sector: 'pesas',
      capacidad: 20,
      ubicacion: 'Edificio A, Piso 1',
      descripcion: 'Sala de prueba para testing'
    });
    log.success('Sala creada exitosamente');
    log.data({ id: nuevaSala._id, nombre: nuevaSala.nombre, sector: nuevaSala.sector });
    
    // 2. Buscar salas activas
    log.info('Buscando salas activas...');
    const salasActivas = await SalaRepo.findActivas();
    log.success(`Se encontraron ${salasActivas.length} salas activas`);
    
    // 3. Buscar por sector
    log.info('Buscando salas del sector "pesas"...');
    const salasPesas = await SalaRepo.findBySector('pesas');
    log.success(`Se encontraron ${salasPesas.length} salas de pesas`);
    
    // 4. Actualizar sala
    log.info('Actualizando capacidad de la sala...');
    const salaActualizada = await SalaRepo.update(nuevaSala._id, {
      capacidad: 25,
      descripcion: 'Capacidad ampliada'
    });
    log.success(`Capacidad actualizada a: ${salaActualizada.capacidad}`);
    
    // 5. Eliminar sala de prueba
    log.info('Eliminando sala de prueba...');
    await SalaRepo.delete(nuevaSala._id);
    log.success('Sala eliminada exitosamente');
    
  } catch (error) {
    log.error(`Error en SalaRepo: ${error.message}`);
  }
}

async function testReservaRepo() {
  log.title('PROBANDO ReservaRepo');
  
  try {
    // Primero necesitamos un usuario y una sala
    log.info('Creando datos de prueba (usuario y sala)...');
    
    const usuarioTest = await UserRepo.create({
      name: 'Usuario Reserva Test',
      email: `reserva${Date.now()}@uct.cl`,
      role: 'alumno'
    });
    
    const salaTest = await SalaRepo.create({
      nombre: `Sala Reserva Test ${Date.now()}`,
      sector: 'maquinas',
      capacidad: 15
    });
    
    log.success('Usuario y sala de prueba creados');
    
    // 1. Crear reserva
    log.info('Creando reserva de prueba...');
    const ahora = new Date();
    const inicio = new Date(ahora.getTime() + 24 * 60 * 60 * 1000); // Mañana
    const fin = new Date(inicio.getTime() + 60 * 60 * 1000); // +1 hora
    
    const nuevaReserva = await ReservaRepo.create({
      usuario: usuarioTest._id,
      sala: salaTest._id,
      inicio: inicio,
      fin: fin,
      estado: 'reservada'
    });
    log.success('Reserva creada exitosamente');
    log.data({ 
      id: nuevaReserva._id,
      usuario: nuevaReserva.usuario.name,
      sala: nuevaReserva.sala.nombre,
      inicio: nuevaReserva.inicio
    });
    
    // 2. Buscar reserva por ID (con populate automático)
    log.info('Buscando reserva por ID (debería traer usuario y sala poblados)...');
    const reservaPorId = await ReservaRepo.findById(nuevaReserva._id);
    log.success('Reserva encontrada con datos poblados:');
    log.data({
      usuario: reservaPorId.usuario?.name,
      sala: reservaPorId.sala?.nombre,
      estado: reservaPorId.estado
    });
    
    // 3. Buscar reservas del usuario
    log.info('Buscando reservas del usuario...');
    const reservasUsuario = await ReservaRepo.findByUsuario(usuarioTest._id);
    log.success(`Usuario tiene ${reservasUsuario.length} reserva(s)`);
    
    // 4. Buscar reservas de la sala
    log.info('Buscando reservas de la sala...');
    const reservasSala = await ReservaRepo.findBySala(salaTest._id);
    log.success(`Sala tiene ${reservasSala.length} reserva(s)`);
    
    // 5. Verificar conflictos de horario
    log.info('Verificando conflictos de horario...');
    const conflictos = await ReservaRepo.findConflictos({
      salaId: salaTest._id,
      inicio: inicio,
      fin: fin
    });
    log.success(`Se encontraron ${conflictos.length} conflicto(s)`);
    
    // 6. Actualizar estado de reserva
    log.info('Cancelando reserva...');
    const reservaCancelada = await ReservaRepo.update(nuevaReserva._id, {
      estado: 'cancelada',
      motivoCancelacion: 'Prueba de cancelación'
    });
    log.success(`Reserva ${reservaCancelada.estado}`);
    
    // 7. Limpiar datos de prueba
    log.info('Limpiando datos de prueba...');
    await ReservaRepo.delete(nuevaReserva._id);
    await UserRepo.delete(usuarioTest._id);
    await SalaRepo.delete(salaTest._id);
    log.success('Datos de prueba eliminados');
    
  } catch (error) {
    log.error(`Error en ReservaRepo: ${error.message}`);
  }
}

async function testConsultasAvanzadas() {
  log.title('PROBANDO CONSULTAS AVANZADAS');
  
  try {
    // 1. Paginación
    log.info('Probando paginación (página 1, 5 items por página)...');
    const pagina1 = await UserRepo.find(
      {},
      { 
        skip: 0,
        limit: 5,
        sort: { createdAt: -1 }
      }
    );
    log.success(`Página 1: ${pagina1.length} usuarios`);
    
    // 2. Proyección (solo campos específicos)
    log.info('Probando proyección (solo name y email)...');
    const usuariosProyectados = await UserRepo.find(
      {},
      { 
        select: 'name email',
        limit: 3
      }
    );
    log.success('Usuarios con campos limitados:');
    usuariosProyectados.forEach(u => log.data({ name: u.name, email: u.email }));
    
    // 3. Búsquedas complejas
    log.info('Probando búsqueda compleja...');
    const busquedaCompleja = await UserRepo.find(
      {
        $or: [
          { role: 'alumno' },
          { role: 'trabajador' }
        ],
        activo: true
      },
      {
        select: 'name role activo',
        sort: { name: 1 },
        limit: 5
      }
    );
    log.success(`Encontrados ${busquedaCompleja.length} usuarios (alumnos o trabajadores activos)`);
    
  } catch (error) {
    log.error(`Error en consultas avanzadas: ${error.message}`);
  }
}

// Función principal
async function runTests() {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    console.log(colors.bold.green('\n🚀 INICIANDO PRUEBAS DE REPOSITORIOS\n'));
    
    // Ejecutar todas las pruebas
    await testUserRepo();
    await testSalaRepo();
    await testReservaRepo();
    await testConsultasAvanzadas();
    
    console.log(colors.bold.green('\n✅ TODAS LAS PRUEBAS COMPLETADAS\n'));
    
  } catch (error) {
    console.error(colors.red('Error general:', error));
  } finally {
    // Cerrar conexión
    process.exit(0);
  }
}

// Ejecutar pruebas
runTests();
