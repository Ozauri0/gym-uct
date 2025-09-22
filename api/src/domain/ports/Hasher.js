/**
 * Hasher Port
 * Define el contrato para el hashing de contraseñas
 */
class Hasher {
  /**
   * Hashea una contraseña
   * @param {string} password 
   * @returns {Promise<string>}
   */
  async hash(password) {
    throw new Error('Method hash must be implemented');
  }

  /**
   * Verifica una contraseña contra su hash
   * @param {string} password 
   * @param {string} hashedPassword 
   * @returns {Promise<boolean>}
   */
  async verify(password, hashedPassword) {
    throw new Error('Method verify must be implemented');
  }
}

module.exports = Hasher;
