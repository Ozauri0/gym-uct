/**
 * HashedPassword Value Object
 * Representa una contraseña ya hasheada de forma segura
 */
class HashedPassword {
  constructor(hashedValue) {
    this.#validate(hashedValue);
    this._hashedValue = hashedValue;
    Object.freeze(this);
  }

  #validate(hashedValue) {
    if (!hashedValue) {
      throw new Error('La contraseña hasheada es requerida');
    }

    if (typeof hashedValue !== 'string') {
      throw new Error('La contraseña hasheada debe ser una cadena de texto');
    }

    if (hashedValue.trim().length === 0) {
      throw new Error('La contraseña hasheada no puede estar vacía');
    }
  }

  get value() {
    return this._hashedValue;
  }

  equals(otherHashedPassword) {
    if (!(otherHashedPassword instanceof HashedPassword)) {
      return false;
    }
    return this._hashedValue === otherHashedPassword._hashedValue;
  }

  toString() {
    return '[HashedPassword]'; // No exponer el hash real
  }

  static create(hashedValue) {
    return new HashedPassword(hashedValue);
  }
}

module.exports = HashedPassword;
