/**
 * UserRepository Port
 * Define el contrato para la persistencia de usuarios
 */
class UserRepository {
  /**
   * Busca un usuario por su email
   * @param {Email} email 
   * @returns {Promise<User|null>}
   */
  async findByEmail(email) {
    throw new Error('Method findByEmail must be implemented');
  }

  /**
   * Busca un usuario por su ID
   * @param {string} id 
   * @returns {Promise<User|null>}
   */
  async findById(id) {
    throw new Error('Method findById must be implemented');
  }

  /**
   * Guarda un nuevo usuario
   * @param {User} user 
   * @returns {Promise<User>}
   */
  async save(user) {
    throw new Error('Method save must be implemented');
  }

  /**
   * Actualiza un usuario existente
   * @param {User} user 
   * @returns {Promise<User>}
   */
  async update(user) {
    throw new Error('Method update must be implemented');
  }

  /**
   * Elimina un usuario
   * @param {string} id 
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    throw new Error('Method delete must be implemented');
  }

  /**
   * Verifica si existe un usuario con el email dado
   * @param {Email} email 
   * @returns {Promise<boolean>}
   */
  async existsByEmail(email) {
    throw new Error('Method existsByEmail must be implemented');
  }
}

module.exports = UserRepository;
