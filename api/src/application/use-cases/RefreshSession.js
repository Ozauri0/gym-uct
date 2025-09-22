const SecurityPolicy = require('../policies/SecurityPolicy');

/**
 * RefreshSession Use Case
 * Refresca una sesión usando refresh token y opcionalmente rota tokens
 */
class RefreshSession {
  constructor({ userRepository, tokenService, tokenRepository, clock }) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.tokenRepository = tokenRepository;
    this.clock = clock;
  }

  /**
   * Ejecuta el caso de uso de refresh de sesión
   * @param {Object} params
   * @param {string} params.refreshToken
   * @returns {Promise<Object>}
   */
  async execute({ refreshToken }) {
    try {
      // 1. Validar entrada
      this.#validateInput({ refreshToken });

      // 2. Verificar refresh token en el servicio de tokens
      const isTokenValid = await this.tokenService.verifyRefreshToken(refreshToken);
      if (!isTokenValid) {
        throw new Error('Invalid refresh token');
      }

      // 3. Buscar token en el repositorio
      const tokenData = await this.tokenRepository.findRefreshToken(refreshToken);
      if (!tokenData) {
        throw new Error('Refresh token not found or revoked');
      }

      // 4. Verificar expiración
      const currentTime = this.clock.now();
      if (SecurityPolicy.isRefreshTokenExpired(tokenData.expiresAt, currentTime)) {
        // Limpiar token expirado
        await this.tokenRepository.revokeRefreshToken(refreshToken);
        throw new Error('Refresh token expired');
      }

      // 5. Buscar usuario asociado
      const user = await this.userRepository.findById(tokenData.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // 6. Verificar que el usuario esté activo
      if (!user.isActive) {
        // Revocar todos los tokens del usuario inactivo
        await this.tokenRepository.revokeAllUserTokens(user.id);
        throw new Error('Account is deactivated');
      }

      // 7. Generar nuevo access token
      const accessTokenPayload = {
        userId: user.id,
        email: user.email.value,
        role: user.role
      };

      const newAccessToken = await this.tokenService.generateAccessToken(
        accessTokenPayload,
        SecurityPolicy.getAccessTokenTTL()
      );

      let newRefreshToken = refreshToken;
      let newRefreshTokenExpiration = tokenData.expiresAt;

      // 8. Rotación de refresh token si está habilitada
      if (SecurityPolicy.requiresTokenRotation()) {
        // Generar nuevo refresh token
        newRefreshToken = await this.tokenService.generateRefreshToken();
        newRefreshTokenExpiration = SecurityPolicy.getRefreshTokenExpiration(currentTime);

        // Revocar el refresh token anterior
        await this.tokenRepository.revokeRefreshToken(refreshToken);

        // Guardar el nuevo refresh token
        await this.tokenRepository.saveRefreshToken(
          user.id,
          newRefreshToken,
          newRefreshTokenExpiration
        );
      }

      // 9. Retornar resultado exitoso
      return {
        success: true,
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
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

  #validateInput({ refreshToken }) {
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new Error('Refresh token is required and must be a string');
    }
  }
}

module.exports = RefreshSession;
