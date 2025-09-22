const User = require('../../domain/entities/User');
const Email = require('../../domain/value-objects/Email');
const HashedPassword = require('../../domain/value-objects/HashedPassword');
const PasswordPolicy = require('../policies/PasswordPolicy');

/**
 * RegisterUser Use Case
 * Registra un nuevo usuario en el sistema
 */
class RegisterUser {
  constructor({ userRepository, hasher, clock }) {
    this.userRepository = userRepository;
    this.hasher = hasher;
    this.clock = clock;
  }

  /**
   * Ejecuta el caso de uso de registro
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.password
   * @param {string} params.name
   * @param {string} params.role
   * @returns {Promise<Object>}
   */
  async execute({ email, password, name, role = 'alumno' }) {
    try {
      // 1. Validar entrada
      this.#validateInput({ email, password, name, role });

      // 2. Validar política de contraseñas
      const passwordValidation = PasswordPolicy.validate(password);
      if (!passwordValidation.isValid) {
        throw new Error(`Validación de contraseña falló: ${passwordValidation.errors.join(', ')}`);
      }

      // 3. Crear value object de email
      const emailVO = Email.create(email);

      // 4. Verificar que el usuario no existe
      const existingUser = await this.userRepository.findByEmail(emailVO);
      if (existingUser) {
        throw new Error('Ya existe un usuario con este email');
      }

      // 5. Hashear contraseña
      const hashedPasswordValue = await this.hasher.hash(password);
      const hashedPassword = HashedPassword.create(hashedPasswordValue);

      // 6. Crear entidad User
      const user = new User({
        email: emailVO,
        hashedPassword,
        name,
        role,
        createdAt: this.clock.now()
      });

      // 7. Persistir usuario
      const savedUser = await this.userRepository.save(user);

      // 8. Retornar resultado sin datos sensibles
      return {
        success: true,
        user: {
          id: savedUser.id,
          email: savedUser.email.value,
          name: savedUser.name,
          role: savedUser.role,
          isActive: savedUser.isActive,
          createdAt: savedUser.createdAt
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  #validateInput({ email, password, name, role }) {
    if (!email || typeof email !== 'string') {
      throw new Error('El email es requerido y debe ser una cadena de texto');
    }

    if (!password || typeof password !== 'string') {
      throw new Error('La contraseña es requerida y debe ser una cadena de texto');
    }

    if (!name || typeof name !== 'string') {
      throw new Error('El nombre es requerido y debe ser una cadena de texto');
    }

    if (role && typeof role !== 'string') {
      throw new Error('El rol debe ser una cadena de texto');
    }
  }
}

module.exports = RegisterUser;
