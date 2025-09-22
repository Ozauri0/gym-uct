const Email = require('../../domain/value-objects/Email');

/**
 * RequestPasswordReset Use Case
 * Solicita un reset de contraseña enviando un token por email
 */
class RequestPasswordReset {
  constructor({ userRepository, tokenService, tokenRepository, clock, emailService }) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.tokenRepository = tokenRepository;
    this.clock = clock;
    this.emailService = emailService;
  }

  /**
   * Ejecuta el caso de uso de solicitud de reset de contraseña
   * @param {Object} params
   * @param {string} params.email
   * @returns {Promise<Object>}
   */
  async execute({ email }) {
    try {
      // 1. Validar entrada
      this.#validateInput({ email });

      // 2. Crear value object de email
      const emailVO = Email.create(email);

      // 3. Buscar usuario (siempre responder éxito por seguridad)
      const user = await this.userRepository.findByEmail(emailVO);
      if (!user) {
        // Por seguridad, no revelar si el email existe o no
        return {
          success: true,
          message: 'If the email exists, a password reset link has been sent'
        };
      }

      // 4. Verificar que el usuario esté activo
      if (!user.isActive) {
        return {
          success: true,
          message: 'If the email exists, a password reset link has been sent'
        };
      }

      // 5. Generar token de reset (válido por 1 hora)
      const resetTokenPayload = {
        userId: user.id,
        type: 'password-reset',
        email: user.email.value
      };

      const resetToken = await this.tokenService.generateAccessToken(resetTokenPayload, '1h');

      // 6. Guardar token en repositorio con expiración
      const expiresAt = new Date(this.clock.now().getTime() + 60 * 60 * 1000); // 1 hora
      await this.tokenRepository.saveResetToken(user.id, resetToken, expiresAt);

      // 7. Enviar email con link de reset (si el servicio está disponible)
      if (this.emailService) {
        await this.emailService.sendPasswordResetEmail(user.email.value, resetToken);
      }

      // 8. Retornar resultado exitoso
      return {
        success: true,
        message: 'If the email exists, a password reset link has been sent',
        ...(process.env.NODE_ENV === 'development' && { resetToken }) // Solo en desarrollo
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  #validateInput({ email }) {
    if (!email || typeof email !== 'string') {
      throw new Error('Email is required and must be a string');
    }
  }
}

module.exports = RequestPasswordReset;
