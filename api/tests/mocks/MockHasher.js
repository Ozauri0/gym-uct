const Hasher = require('../../src/domain/ports/Hasher');

/**
 * MockHasher
 * Implementación mock del Hasher para testing (NO usar en producción)
 */
class MockHasher extends Hasher {
  constructor() {
    super();
    this.hashPrefix = 'hashed:';
  }

  async hash(password) {
    // Simulación simple: añadir prefijo
    return this.hashPrefix + password;
  }

  async verify(password, hashedPassword) {
    // Verificar que el hash corresponde a la contraseña
    return hashedPassword === this.hashPrefix + password;
  }
}

module.exports = MockHasher;
