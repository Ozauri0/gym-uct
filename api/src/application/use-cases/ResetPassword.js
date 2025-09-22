const HashedPassword = require('../../domain/value-objects/HashedPassword');
const PasswordPolicy = require('../policies/PasswordPolicy');

/**
 * ResetPassword Use Case
 * Resetea la contraseña de un usuario usando un token válido
 */
class ResetPassword {
  constructor({ userRepository, hasher, tokenService, tokenRepository, clock }) {
    this.userRepository = userRepository;
    this.hasher = hasher;
    this.tokenService = tokenService;
    this.tokenRepository = tokenRepository;
    this.clock = clock;
  }

  /**
   * Ejecuta el caso de uso de reset de contraseña
   * @param {Object} params
   * @param {string} params.resetToken
   * @param {string} params.newPassword
   * @returns {Promise<Object>}
   */
  async execute({ resetToken, newPassword }) {
    try {
      // 1. Validar entrada
      this.#validateInput({ resetToken, newPassword });

      // 2. Validar política de contraseñas
      const passwordValidation = PasswordPolicy.validate(newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
      }

      // 3. Verificar y decodificar token
      let tokenPayload;
      try {
        tokenPayload = await this.tokenService.verifyAccessToken(resetToken);
      } catch (error) {
        throw new Error('Invalid or expired reset token');
      }

      // 4. Verificar que es un token de reset
      if (tokenPayload.type !== 'password-reset') {
        throw new Error('Invalid token type');
      }

      // 5. Verificar token en repositorio
      const tokenData = await this.tokenRepository.findResetToken(resetToken);
      if (!tokenData) {
        throw new Error('Reset token not found or already used');
      }

      // 6. Verificar expiración
      const currentTime = this.clock.now();
      if (currentTime >= tokenData.expiresAt) {
        await this.tokenRepository.revokeResetToken(resetToken);
        throw new Error('Reset token expired');
      }

      // 7. Buscar usuario
      const user = await this.userRepository.findById(tokenPayload.userId);
      if (!user) {
        throw new Error('User not found');
      }

      // 8. Verificar que el usuario esté activo
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // 9. Hashear nueva contraseña
      const hashedPasswordValue = await this.hasher.hash(newPassword);
      const hashedPassword = HashedPassword.create(hashedPasswordValue);

      // 10. Actualizar contraseña del usuario
      user.changePassword(hashedPassword);
      
      // Resetear intentos de login y desbloquear cuenta si estaba bloqueada
      user.resetLoginAttempts();
      
      // Actualizar usuario en base de datos
      await this.userRepository.update(user);

      // 11. Revocar el token de reset (uso único)
      await this.tokenRepository.revokeResetToken(resetToken);

      // 12. Opcional: Revocar todos los refresh tokens existentes por seguridad
      await this.tokenRepository.revokeAllUserTokens(user.id);

      // 13. Retornar resultado exitoso
      return {
        success: true,
        message: 'Password reset successfully. Please login with your new password.'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  #validateInput({ resetToken, newPassword }) {
    if (!resetToken || typeof resetToken !== 'string') {
      throw new Error('Reset token is required and must be a string');
    }

    if (!newPassword || typeof newPassword !== 'string') {
      throw new Error('New password is required and must be a string');
    }
  }
}

module.exports = ResetPassword;
