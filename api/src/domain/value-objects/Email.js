/**
 * Email Value Object
 * Inmutable value object que representa un email válido
 */
class Email {
  constructor(value) {
    this.#validate(value);
    this._value = value.toLowerCase().trim();
    Object.freeze(this);
  }

  #validate(value) {
    if (value === null || value === undefined) {
      throw new Error('El email es requerido');
    }

    if (typeof value !== 'string') {
      throw new Error('El email debe ser una cadena de texto');
    }

    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
      throw new Error('El email no puede estar vacío');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedValue)) {
      throw new Error('Formato de email inválido');
    }

    // Validar que sea un email de UCT
    const allowedDomains = ['@uct.cl', '@alu.uct.cl'];
    const isValidDomain = allowedDomains.some(domain => trimmedValue.toLowerCase().endsWith(domain));
    
    if (!isValidDomain) {
      throw new Error('El email debe ser de dominio UCT (@uct.cl o @alu.uct.cl)');
    }

    if (trimmedValue.length > 254) {
      throw new Error('El email es demasiado largo');
    }
  }

  get value() {
    return this._value;
  }

  equals(otherEmail) {
    if (!(otherEmail instanceof Email)) {
      return false;
    }
    return this._value === otherEmail._value;
  }

  toString() {
    return this._value;
  }

  static create(value) {
    return new Email(value);
  }
}

module.exports = Email;
