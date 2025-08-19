const User = require('../models/User');
const colors = require('colors');

// @desc    Obtener todos los usuarios
// @route   GET /api/users
// @access  Public
exports.getUsers = async (req, res, next) => {
  try {
    console.log(`${colors.blue('ℹ')} Consultando todos los usuarios...`);
    const users = await User.find();
    
    console.log(`${colors.green('✓')} Se encontraron ${colors.bold.cyan(users.length)} usuarios`);
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
      timestamp: new Date().toISOString(),
      request: {
        type: 'GET',
        description: 'Obtener todos los usuarios'
      }
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
    
    const user = await User.findById(userId);
    
    if (!user) {
      console.log(`${colors.yellow('⚠')} Usuario no encontrado con ID: ${colors.cyan(userId)}`);
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${userId} no encontrado`,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`${colors.green('✓')} Usuario encontrado: ${colors.bold.cyan(user.name)}`);
    
    res.status(200).json({
      success: true,
      data: user,
      timestamp: new Date().toISOString(),
      request: {
        type: 'GET',
        description: 'Obtener usuario específico',
        userId: userId
      }
    });
  } catch (error) {
    console.error(`${colors.red('✖')} Error al buscar usuario: ${error.message}`);
    next(error);
  }
};

// @desc    Crear un nuevo usuario
// @route   POST /api/users
// @access  Public
exports.createUser = async (req, res, next) => {
  try {
    console.log(`${colors.blue('ℹ')} Creando nuevo usuario con datos: ${colors.cyan(JSON.stringify(req.body))}`);
    
    const user = await User.create(req.body);
    
    console.log(`${colors.green('✓')} Usuario creado exitosamente con ID: ${colors.bold.cyan(user._id)}`);
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: user,
      timestamp: new Date().toISOString(),
      request: {
        type: 'POST',
        description: 'Crear nuevo usuario'
      }
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
    console.log(`${colors.blue('ℹ')} Datos de actualización: ${colors.cyan(JSON.stringify(req.body))}`);
    
    let user = await User.findById(userId);
    
    if (!user) {
      console.log(`${colors.yellow('⚠')} Usuario no encontrado con ID: ${colors.cyan(userId)}`);
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${userId} no encontrado`,
        timestamp: new Date().toISOString()
      });
    }
    
    user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true
    });
    
    console.log(`${colors.green('✓')} Usuario actualizado exitosamente: ${colors.bold.cyan(user.name)}`);
    
    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user,
      timestamp: new Date().toISOString(),
      request: {
        type: 'PUT',
        description: 'Actualizar usuario',
        userId: userId
      }
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
    
    const user = await User.findById(userId);
    
    if (!user) {
      console.log(`${colors.yellow('⚠')} Usuario no encontrado con ID: ${colors.cyan(userId)}`);
      return res.status(404).json({
        success: false,
        message: `Usuario con ID ${userId} no encontrado`,
        timestamp: new Date().toISOString()
      });
    }
    
    await user.deleteOne();
    
    console.log(`${colors.green('✓')} Usuario eliminado exitosamente: ${colors.bold.cyan(user.name)}`);
    
    res.status(200).json({
      success: true,
      message: `Usuario ${user.name} eliminado exitosamente`,
      timestamp: new Date().toISOString(),
      request: {
        type: 'DELETE',
        description: 'Eliminar usuario',
        userId: userId
      }
    });
  } catch (error) {
    console.error(`${colors.red('✖')} Error al eliminar usuario: ${error.message}`);
    next(error);
  }
};