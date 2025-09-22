const User = require('../models/User');

/**
 * MongoUserRepository - Implementación real de UserRepository usando MongoDB
 * Mantiene la arquitectura hexagonal
 */
class MongoUserRepository {
  
  async save(user) {
    try {
      const mongoUser = new User({
        email: user.email.value,
        hashedPassword: user.hashedPassword.value,
        name: user.name,
        role: user.role,
        activo: user.isActive, // Mapear isActive del dominio a activo de la BD
        createdAt: user.createdAt
      });

      const savedUser = await mongoUser.save();
      
      // Retornar en formato de dominio
      return {
        id: savedUser._id.toString(),
        email: { value: savedUser.email },
        hashedPassword: { value: savedUser.hashedPassword },
        name: savedUser.name,
        role: savedUser.role,
        isActive: savedUser.activo, // Mapear activo de la BD a isActive del dominio
        createdAt: savedUser.createdAt
      };
    } catch (error) {
      throw new Error(`Error al guardar usuario: ${error.message}`);
    }
  }

  async findByEmail(emailVO) {
    try {
      const mongoUser = await User.findOne({ 
        email: emailVO.value.toLowerCase() 
      });

      if (!mongoUser) {
        return null;
      }

      // Retornar en formato de dominio
      return {
        id: mongoUser._id.toString(),
        email: { value: mongoUser.email },
        hashedPassword: { value: mongoUser.hashedPassword },
        name: mongoUser.name,
        role: mongoUser.role,
        isActive: mongoUser.activo, // Mapear activo de la BD a isActive del dominio
        createdAt: mongoUser.createdAt,
        loginAttempts: mongoUser.loginAttempts || 0,
        lockedUntil: mongoUser.lockedUntil,
        lastLogin: mongoUser.lastLogin,
        
        // Métodos del dominio
        incrementLoginAttempts() {
          this.loginAttempts = (this.loginAttempts || 0) + 1;
        },
        
        shouldLockAccount(maxAttempts) {
          return this.loginAttempts >= maxAttempts;
        },
        
        lockAccount(duration) {
          this.lockedUntil = Date.now() + duration;
        },
        
        isAccountLocked(currentTime) {
          return this.lockedUntil && this.lockedUntil > currentTime;
        },
        
        updateLastLogin(timestamp) {
          this.lastLogin = timestamp;
          this.loginAttempts = 0;
          this.lockedUntil = null;
        }
      };
    } catch (error) {
      throw new Error(`Error al buscar usuario: ${error.message}`);
    }
  }

  async update(user) {
    try {
      await User.findByIdAndUpdate(user.id, {
        loginAttempts: user.loginAttempts,
        lockedUntil: user.lockedUntil,
        lastLogin: user.lastLogin,
        activo: user.isActive // Mapear isActive del dominio a activo de la BD
      });
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const mongoUser = await User.findById(id);
      
      if (!mongoUser) {
        return null;
      }

      return {
        id: mongoUser._id.toString(),
        email: { value: mongoUser.email },
        hashedPassword: { value: mongoUser.hashedPassword },
        name: mongoUser.name,
        role: mongoUser.role,
        isActive: mongoUser.activo, // Mapear activo de la BD a isActive del dominio
        createdAt: mongoUser.createdAt
      };
    } catch (error) {
      throw new Error(`Error al buscar usuario por ID: ${error.message}`);
    }
  }
}

module.exports = MongoUserRepository;
