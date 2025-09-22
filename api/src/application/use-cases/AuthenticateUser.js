const Email = require('../../domain/value-objects/Email');
const SecurityPolicy = require('../policies/SecurityPolicy');

/**
 * AuthenticateUser Use Case
 * Autentica un usuario y genera tokens
 */
class AuthenticateUser {
  constructor({ userRepository, hasher, tokenService, tokenRepository, clock }) {
    this.userRepository = userRepository;
    this.hasher = hasher;
    this.tokenService = tokenService;
    this.tokenRepository = tokenRepository;
    this.clock = clock;
  }

  /**
   * Ejecuta el caso de uso de autenticación
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.password
   * @returns {Promise<Object>}
   */
  async execute({ email, password }) {
    try {
      // 1. Validar entrada
      this.#validateInput({ email, password });

      // 2. Crear value object de email
      const emailVO = Email.create(email);

      // 3. Buscar usuario
      const user = await this.userRepository.findByEmail(emailVO);
      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // 4. Verificar si el usuario está activo
      if (!user.isActive) {
        throw new Error('La cuenta está desactivada');
      }

      // 5. Verificar si la cuenta está bloqueada
      const currentTime = this.clock.now();
      if (user.isAccountLocked(currentTime)) {
        const lockTimeRemaining = Math.ceil((user.lockedUntil - currentTime) / (1000 * 60));
        throw new Error(`La cuenta está bloqueada. Intenta de nuevo en ${lockTimeRemaining} minutos`);
      }

      // 6. Verificar contraseña
      const isPasswordValid = await this.hasher.verify(password, user.hashedPassword.value);
      
      if (!isPasswordValid) {
        // Incrementar intentos fallidos
        user.incrementLoginAttempts();
        
        // Bloquear cuenta si es necesario
        if (user.shouldLockAccount(SecurityPolicy.MAX_LOGIN_ATTEMPTS)) {
          const lockDuration = SecurityPolicy.getLockoutDuration(user.loginAttempts);
          user.lockAccount(lockDuration);
        }
        
        // Actualizar usuario en base de datos
        await this.userRepository.update(user);
        
        throw new Error('Credenciales inválidas');
      }

      // 7. Autenticación exitosa - resetear intentos y actualizar último login
      user.updateLastLogin(currentTime);
      await this.userRepository.update(user);

      // 8. Generar tokens
      const accessTokenPayload = {
        userId: user.id,
        email: user.email.value,
        role: user.role
      };

      const accessToken = await this.tokenService.generateAccessToken(
        accessTokenPayload,
        SecurityPolicy.getAccessTokenTTL()
      );

      const refreshToken = await this.tokenService.generateRefreshToken();

      // 9. Guardar refresh token
      const refreshTokenExpiration = SecurityPolicy.getRefreshTokenExpiration(currentTime);
      await this.tokenRepository.saveRefreshToken(user.id, refreshToken, refreshTokenExpiration);

      // 10. Retornar resultado exitoso
      return {
        success: true,
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: SecurityPolicy.getAccessTokenTTL()
        },
        user: {
          id: user.id,
          email: user.email.value,
          name: user.name,
          role: user.role
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  #validateInput({ email, password }) {
    if (!email || typeof email !== 'string') {
      throw new Error('El email es requerido y debe ser una cadena de texto');
    }

    if (!password || typeof password !== 'string') {
      throw new Error('La contraseña es requerida y debe ser una cadena de texto');
    }
  }
}

module.exports = AuthenticateUser;
