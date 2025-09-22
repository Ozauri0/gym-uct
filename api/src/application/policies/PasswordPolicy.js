/**
 * PasswordPolicy
 * Define las reglas de validación para contraseñas
 */
class PasswordPolicy {
  static MIN_LENGTH = 8;
  static MAX_LENGTH = 128;
  static REQUIRE_UPPERCASE = true;
  static REQUIRE_LOWERCASE = true;
  static REQUIRE_NUMBERS = true;
  static REQUIRE_SPECIAL_CHARS = true;

  /**
   * Valida si una contraseña cumple con las políticas de seguridad
   * @param {string} password 
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  static validate(password) {
    const errors = [];

    if (!password || typeof password !== 'string') {
      errors.push('La contraseña es requerida y debe ser una cadena de texto');
      return { isValid: false, errors };
    }

    if (password.length < this.MIN_LENGTH) {
      errors.push(`La contraseña debe tener al menos ${this.MIN_LENGTH} caracteres`);
    }

    if (password.length > this.MAX_LENGTH) {
      errors.push(`La contraseña no debe exceder los ${this.MAX_LENGTH} caracteres`);
    }

    if (this.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    }

    if (this.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula');
    }

    if (this.REQUIRE_NUMBERS && !/\d/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }

    if (this.REQUIRE_SPECIAL_CHARS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('La contraseña debe contener al menos un carácter especial');
    }

    // Verificar patrones comunes débiles
    const weakPatterns = [
      /^(.)\1+$/, // Todos los caracteres iguales
      /^(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i, // Secuencias
      /^(password|123456|qwerty|admin|letmein)/i // Contraseñas comunes
    ];

    for (const pattern of weakPatterns) {
      if (pattern.test(password)) {
        errors.push('La contraseña contiene patrones débiles comunes');
        break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Genera un mensaje descriptivo de los requisitos de contraseña
   * @returns {string}
   */
  static getRequirementsMessage() {
    const requirements = [
      `Al menos ${this.MIN_LENGTH} caracteres`,
      `No más de ${this.MAX_LENGTH} caracteres`
    ];

    if (this.REQUIRE_UPPERCASE) requirements.push('Al menos una letra mayúscula');
    if (this.REQUIRE_LOWERCASE) requirements.push('Al menos una letra minúscula');
    if (this.REQUIRE_NUMBERS) requirements.push('Al menos un número');
    if (this.REQUIRE_SPECIAL_CHARS) requirements.push('Al menos un carácter especial');

    return `La contraseña debe cumplir los siguientes requisitos:\n• ${requirements.join('\n• ')}`;
  }
}

module.exports = PasswordPolicy;
