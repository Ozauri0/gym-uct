const Email = require('../value-objects/Email');
const HashedPassword = require('../value-objects/HashedPassword');

/**
 * User Entity
 * Entidad de dominio que representa un usuario del sistema
 */
class User {
  constructor({ id, email, hashedPassword, name, role = 'alumno', isActive = true, createdAt, lastLoginAt = null, loginAttempts = 0, lockedUntil = null }) {
    this.#validate({ email, hashedPassword, name, role });
    
    this._id = id;
    this._email = email instanceof Email ? email : Email.create(email);
    this._hashedPassword = hashedPassword instanceof HashedPassword ? hashedPassword : HashedPassword.create(hashedPassword);
    this._name = name.trim();
    this._role = role;
    this._isActive = isActive;
    this._createdAt = createdAt || new Date();
    this._lastLoginAt = lastLoginAt;
    this._loginAttempts = loginAttempts;
    this._lockedUntil = lockedUntil;
  }

  #validate({ email, hashedPassword, name, role }) {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new Error('El nombre es requerido y debe ser una cadena de texto no vacía');
    }

    if (name.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }

    if (name.trim().length > 100) {
      throw new Error('El nombre es demasiado largo');
    }

    const validRoles = ['alumno', 'staff', 'admin'];
    if (!validRoles.includes(role)) {
      throw new Error(`Rol inválido. Debe ser uno de: ${validRoles.join(', ')}`);
    }
  }

  // Getters
  get id() {
    return this._id;
  }

  get email() {
    return this._email;
  }

  get hashedPassword() {
    return this._hashedPassword;
  }

  get name() {
    return this._name;
  }

  get role() {
    return this._role;
  }

  get isActive() {
    return this._isActive;
  }

  get createdAt() {
    return this._createdAt;
  }

  get lastLoginAt() {
    return this._lastLoginAt;
  }

  get loginAttempts() {
    return this._loginAttempts;
  }

  get lockedUntil() {
    return this._lockedUntil;
  }

  // Métodos de dominio
  deactivate() {
    this._isActive = false;
  }

  activate() {
    this._isActive = true;
    this.resetLoginAttempts();
  }

  updateLastLogin(loginTime = new Date()) {
    this._lastLoginAt = loginTime;
    this.resetLoginAttempts();
  }

  incrementLoginAttempts() {
    this._loginAttempts += 1;
  }

  resetLoginAttempts() {
    this._loginAttempts = 0;
    this._lockedUntil = null;
  }

  lockAccount(lockDuration = 15 * 60 * 1000) { // 15 minutos por defecto
    this._lockedUntil = new Date(Date.now() + lockDuration);
  }

  isAccountLocked(currentTime = new Date()) {
    return this._lockedUntil && currentTime < this._lockedUntil;
  }

  shouldLockAccount(maxAttempts = 5) {
    return this._loginAttempts >= maxAttempts;
  }

  changePassword(newHashedPassword) {
    if (!(newHashedPassword instanceof HashedPassword)) {
      throw new Error('La contraseña debe ser una instancia de HashedPassword');
    }
    this._hashedPassword = newHashedPassword;
  }

  updateProfile(name, email) {
    if (name) {
      this.#validate({ name, email: this._email.value, hashedPassword: 'dummy', role: this._role });
      this._name = name.trim();
    }
    
    if (email) {
      this._email = email instanceof Email ? email : Email.create(email);
    }
  }

  // Método para crear instancia desde datos persistidos
  static fromPersistence(data) {
    return new User({
      id: data.id || data._id,
      email: data.email,
      hashedPassword: data.hashedPassword || data.password,
      name: data.name,
      role: data.role,
      isActive: data.isActive,
      createdAt: data.createdAt,
      lastLoginAt: data.lastLoginAt,
      loginAttempts: data.loginAttempts,
      lockedUntil: data.lockedUntil
    });
  }

  // Método para convertir a objeto plano para persistencia
  toPersistence() {
    return {
      id: this._id,
      email: this._email.value,
      hashedPassword: this._hashedPassword.value,
      name: this._name,
      role: this._role,
      isActive: this._isActive,
      createdAt: this._createdAt,
      lastLoginAt: this._lastLoginAt,
      loginAttempts: this._loginAttempts,
      lockedUntil: this._lockedUntil
    };
  }

  equals(otherUser) {
    if (!(otherUser instanceof User)) {
      return false;
    }
    return this._id === otherUser._id;
  }
}

module.exports = User;
