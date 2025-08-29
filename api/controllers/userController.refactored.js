/**
 * Controlador de usuarios REFACTORIZADO con patrón Repository
 * Este es un ejemplo de cómo usar los repositorios en lugar de acceder directamente a los modelos
 */

const { UserRepo } = require('../repositories');
const colors = require('colors');

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Public
exports.getUsers = async (req, res, next) => {
  try {
    console.log(`${colors.blue('ℹ')} Consultando todos los usuarios...`);
    
    // Usando el repositorio en lugar del modelo directamente
    const users = await UserRepo.find(
      {}, // filtro vacío = todos
      {
        sort: { createdAt: -1 }, // ordenar por más recientes
        lean: true // mejor performance para solo lectura
      }
    );
    
    console.log(`${colors.green('✓')} Se encontraron ${colors.bold.cyan(users.length)} usuarios`);
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`${colors.red('✖')} Error al obtener usuarios: ${error.message}`);
    next(error);
  }
};

// @desc    Obtener usuario por ID
// @route   GET /api/users/:id
// @access  Public
exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log(`${colors.blue('ℹ')} Buscando usuario con ID: ${colors.cyan(userId)}`);
    
    // Usando el repositorio
    const user = await UserRepo.findById(userId);
    
    if (!user) {
      console.log(`${colors.yellow('⚠')} Usuario no encontrado con ID: ${colors.cyan(userId)}`);
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${userId} no encontrado`
      });
    }
    
    console.log(`${colors.green('✓')} Usuario encontrado: ${colors.bold.cyan(user.name)}`);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(`${colors.red('✖')} Error al buscar usuario: ${error.message}`);
    next(error);
  }
};

// @desc    Buscar usuario por email
// @route   GET /api/users/email/:email
// @access  Public
exports.getUserByEmail = async (req, res, next) => {
  try {
    const email = req.params.email;
    console.log(`${colors.blue('ℹ')} Buscando usuario con email: ${colors.cyan(email)}`);
    
    // Método específico del UserRepo
    const user = await UserRepo.findByEmail(email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Usuario con email ${email} no encontrado`
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Buscar usuario por RUT
// @route   GET /api/users/rut/:rut
// @access  Public
exports.getUserByRut = async (req, res, next) => {
  try {
    const rut = req.params.rut;
    
    // Método específico del UserRepo
    const user = await UserRepo.findByRut(rut);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Usuario con RUT ${rut} no encontrado`
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener usuarios activos
// @route   GET /api/users/active
// @access  Public
exports.getActiveUsers = async (req, res, next) => {
  try {
    // Paginación desde query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Método específico del UserRepo con paginación
    const users = await UserRepo.findActivos({
      skip,
      limit,
      sort: { name: 1 }, // ordenar alfabéticamente
      select: 'name email role carrera activo' // solo campos necesarios
    });
    
    res.status(200).json({
      success: true,
      count: users.length,
      page,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Crear un nuevo usuario
// @route   POST /api/users
// @access  Public
exports.createUser = async (req, res, next) => {
  try {
    console.log(`${colors.blue('ℹ')} Creando nuevo usuario...`);
    
    // Verificar si el email ya existe
    const existingUser = await UserRepo.findByEmail(req.body.email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con ese email'
      });
    }
    
    // Crear usuario usando el repositorio
    const user = await UserRepo.create(req.body);
    
    console.log(`${colors.green('✓')} Usuario creado exitosamente con ID: ${colors.bold.cyan(user._id)}`);
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: user
    });
  } catch (error) {
    console.error(`${colors.red('✖')} Error al crear usuario: ${error.message}`);
    next(error);
  }
};

// @desc    Actualizar usuario
// @route   PUT /api/users/:id
// @access  Public
exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log(`${colors.blue('ℹ')} Actualizando usuario con ID: ${colors.cyan(userId)}`);
    
    // Verificar que existe antes de actualizar
    const exists = await UserRepo.findById(userId);
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${userId} no encontrado`
      });
    }
    
    // Actualizar usando el repositorio
    const user = await UserRepo.update(
      userId, 
      req.body,
      {
        newDoc: true, // retornar el documento actualizado
        runValidators: true // ejecutar validaciones del modelo
      }
    );
    
    console.log(`${colors.green('✓')} Usuario actualizado exitosamente: ${colors.bold.cyan(user.name)}`);
    
    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user
    });
  } catch (error) {
    console.error(`${colors.red('✖')} Error al actualizar usuario: ${error.message}`);
    next(error);
  }
};

// @desc    Eliminar usuario
// @route   DELETE /api/users/:id
// @access  Public
exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    console.log(`${colors.blue('ℹ')} Eliminando usuario con ID: ${colors.cyan(userId)}`);
    
    // Verificar que existe antes de eliminar
    const user = await UserRepo.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${userId} no encontrado`
      });
    }
    
    // Eliminar usando el repositorio
    await UserRepo.delete(userId);
    
    console.log(`${colors.green('✓')} Usuario eliminado exitosamente: ${colors.bold.cyan(user.name)}`);
    
    res.status(200).json({
      success: true,
      message: `Usuario ${user.name} eliminado exitosamente`
    });
  } catch (error) {
    console.error(`${colors.red('✖')} Error al eliminar usuario: ${error.message}`);
    next(error);
  }
};

// @desc    Búsqueda avanzada de usuarios
// @route   POST /api/users/search
// @access  Public
exports.searchUsers = async (req, res, next) => {
  try {
    const { 
      role, 
      carrera, 
      activo,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.body;
    
    // Construir filtro dinámicamente
    const filter = {};
    if (role) filter.role = role;
    if (carrera) filter.carrera = carrera;
    if (typeof activo === 'boolean') filter.activo = activo;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Opciones de consulta
    const options = {
      skip: (page - 1) * limit,
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
      lean: true
    };
    
    // Búsqueda usando el repositorio
    const users = await UserRepo.find(filter, options);
    
    res.status(200).json({
      success: true,
      count: users.length,
      page: parseInt(page),
      limit: parseInt(limit),
      data: users
    });
  } catch (error) {
    next(error);
  }
};
