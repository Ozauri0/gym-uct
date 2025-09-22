const bcrypt = require('bcrypt');
const Hasher = require('../../domain/ports/Hasher');

/**
 * BcryptHasher Adapter
 * Implementa el port Hasher usando bcrypt
 */
class BcryptHasher extends Hasher {
  constructor(saltRounds = 12) {
    super();
    this.saltRounds = saltRounds;
  }

  /**
   * Hashea una contraseña usando bcrypt
   * @param {string} password 
   * @returns {Promise<string>}
   */
  async hash(password) {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      throw new Error(`Failed to hash password: ${error.message}`);
    }
  }

  /**
   * Verifica una contraseña contra su hash usando bcrypt
   * @param {string} password 
   * @param {string} hashedPassword 
   * @returns {Promise<boolean>}
   */
  async verify(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error(`Failed to verify password: ${error.message}`);
    }
  }
}

module.exports = BcryptHasher;
