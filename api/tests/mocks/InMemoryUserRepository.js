const UserRepository = require('../../src/domain/ports/UserRepository');

/**
 * InMemoryUserRepository
 * Implementación en memoria del UserRepository para testing
 */
class InMemoryUserRepository extends UserRepository {
  constructor() {
    super();
    this.users = new Map();
    this.nextId = 1;
  }

  async findByEmail(email) {
    const emailValue = email.value || email;
    for (const user of this.users.values()) {
      if (user.email.value === emailValue) {
        return user;
      }
    }
    return null;
  }

  async findById(id) {
    return this.users.get(id) || null;
  }

  async save(user) {
    const id = this.nextId.toString();
    this.nextId++;
    
    const userWithId = new (user.constructor)({
      id,
      email: user.email,
      hashedPassword: user.hashedPassword,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      loginAttempts: user.loginAttempts,
      lockedUntil: user.lockedUntil
    });
    
    this.users.set(id, userWithId);
    return userWithId;
  }

  async update(user) {
    if (!this.users.has(user.id)) {
      throw new Error('User not found');
    }
    this.users.set(user.id, user);
    return user;
  }

  async delete(id) {
    return this.users.delete(id);
  }

  async existsByEmail(email) {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  // Métodos de utilidad para testing
  clear() {
    this.users.clear();
    this.nextId = 1;
  }

  size() {
    return this.users.size;
  }

  getAll() {
    return Array.from(this.users.values());
  }
}

module.exports = InMemoryUserRepository;
