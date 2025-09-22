const express = require('express');
const colors = require('colors');

// Importar casos de uso hexagonales - RUTA CORREGIDA
const {
  useCases: { RegisterUser, AuthenticateUser },
  adapters: { SystemClock, BcryptHasher, JwtTokenService }
} = require('../src/index');

// Importar repositorios reales de MongoDB
const MongoUserRepository = require('../repositories/MongoUserRepository');

const router = express.Router();

// Configurar adaptadores
const clock = new SystemClock();
const hasher = new BcryptHasher();
const tokenService = new JwtTokenService({
  accessTokenSecret: process.env.JWT_SECRET || 'dev-secret-key',
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key'
});
const userRepository = new MongoUserRepository();
// Por ahora mantenemos el tokenRepository en memoria hasta crear el MongoDB
const InMemoryTokenRepository = require('../tests/mocks/InMemoryTokenRepository');
const tokenRepository = new InMemoryTokenRepository();

// Configurar casos de uso
const registerUserUseCase = new RegisterUser({
  userRepository,
  hasher,
  clock
});

const authenticateUserUseCase = new AuthenticateUser({
  userRepository,
  tokenRepository,
  hasher,
  tokenService,
  clock
});

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    console.log(`${colors.blue('ℹ')} Registrando nuevo usuario: ${colors.cyan(req.body.email)}`);

    const { name, email, password, role = 'alumno' } = req.body;

    // Ejecutar caso de uso
    const result = await registerUserUseCase.execute({
      name,
      email,
      password,
      role
    });

    if (!result.success) {
      console.log(`${colors.yellow('⚠')} Error en registro: ${result.error}`);
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    console.log(`${colors.green('✓')} Usuario registrado exitosamente: ${colors.bold.cyan(result.user.email)}`);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role
      }
    });

  } catch (error) {
    console.error(`${colors.red('✖')} Error en registro: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// @desc    Autenticar usuario
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    console.log(`${colors.blue('ℹ')} Intentando autenticar usuario: ${colors.cyan(req.body.email)}`);

    const { email, password } = req.body;

    // Ejecutar caso de uso
    const result = await authenticateUserUseCase.execute({
      email,
      password
    });

    if (!result.success) {
      console.log(`${colors.yellow('⚠')} Error en autenticación: ${result.error}`);
      return res.status(401).json({
        success: false,
        error: result.error
      });
    }

    console.log(`${colors.green('✓')} Usuario autenticado exitosamente: ${colors.bold.cyan(result.user.email)}`);

    res.status(200).json({
      success: true,
      message: 'Autenticación exitosa',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role
      },
      tokens: {
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        expiresIn: result.tokens.expiresIn
      }
    });

  } catch (error) {
    console.error(`${colors.red('✖')} Error en autenticación: ${error.message}`);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

module.exports = router;
