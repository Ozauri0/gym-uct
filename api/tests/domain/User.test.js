const User = require('../../src/domain/entities/User');
const Email = require('../../src/domain/value-objects/Email');
const HashedPassword = require('../../src/domain/value-objects/HashedPassword');

describe('User Entity', () => {
  const validUserData = {
    email: 'test@uct.cl',
    hashedPassword: 'hashed:password123',
    name: 'Test User',
    role: 'alumno'
  };

  describe('User creation', () => {
    test('should create user with valid data', () => {
      const user = new User(validUserData);
      
      expect(user.name).toBe('Test User');
      expect(user.role).toBe('alumno');
      expect(user.isActive).toBe(true);
      expect(user.email).toBeInstanceOf(Email);
      expect(user.hashedPassword).toBeInstanceOf(HashedPassword);
      expect(user.email.value).toBe('test@uct.cl');
      expect(user.loginAttempts).toBe(0);
      expect(user.lockedUntil).toBeNull();
    });

    test('should create user with email and password objects', () => {
      const email = Email.create('test@uct.cl');
      const hashedPassword = HashedPassword.create('hashed:password123');
      
      const user = new User({
        ...validUserData,
        email,
        hashedPassword
      });
      
      expect(user.email).toBe(email);
      expect(user.hashedPassword).toBe(hashedPassword);
    });

    test('should set default values correctly', () => {
      const user = new User(validUserData);
      
      expect(user.role).toBe('alumno');
      expect(user.isActive).toBe(true);
      expect(user.loginAttempts).toBe(0);
      expect(user.lastLoginAt).toBeNull();
      expect(user.lockedUntil).toBeNull();
    });
  });

  describe('Validación de usuario', () => {
    test('debería lanzar error para nombre faltante', () => {
      expect(() => new User({
        ...validUserData,
        name: ''
      })).toThrow('El nombre es requerido');
    });

    test('debería lanzar error para nombre muy corto', () => {
      expect(() => new User({
        ...validUserData,
        name: 'A'
      })).toThrow('El nombre debe tener al menos 2 caracteres');
    });

    test('debería lanzar error para nombre muy largo', () => {
      const longName = 'A'.repeat(101);
      expect(() => new User({
        ...validUserData,
        name: longName
      })).toThrow('El nombre es demasiado largo');
    });

    test('debería lanzar error para rol inválido', () => {
      expect(() => new User({
        ...validUserData,
        role: 'invalid'
      })).toThrow('Rol inválido');
    });

    test('should trim name whitespace', () => {
      const user = new User({
        ...validUserData,
        name: '  Test User  '
      });
      expect(user.name).toBe('Test User');
    });
  });

  describe('Account locking functionality', () => {
    test('should increment login attempts', () => {
      const user = new User(validUserData);
      
      user.incrementLoginAttempts();
      expect(user.loginAttempts).toBe(1);
      
      user.incrementLoginAttempts();
      expect(user.loginAttempts).toBe(2);
    });

    test('should reset login attempts', () => {
      const user = new User(validUserData);
      user.incrementLoginAttempts();
      user.incrementLoginAttempts();
      
      user.resetLoginAttempts();
      expect(user.loginAttempts).toBe(0);
      expect(user.lockedUntil).toBeNull();
    });

    test('should lock account with duration', () => {
      const user = new User(validUserData);
      const lockDuration = 15 * 60 * 1000; // 15 minutes
      
      user.lockAccount(lockDuration);
      
      expect(user.lockedUntil).toBeInstanceOf(Date);
      expect(user.lockedUntil.getTime()).toBeGreaterThan(Date.now());
    });

    test('should detect locked account', () => {
      const user = new User(validUserData);
      const now = new Date();
      const futureTime = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes later
      
      user.lockAccount(15 * 60 * 1000); // Lock for 15 minutes
      
      expect(user.isAccountLocked(now)).toBe(true);
      expect(user.isAccountLocked(futureTime)).toBe(true);
      
      const pastLockTime = new Date(now.getTime() + 20 * 60 * 1000); // 20 minutes later
      expect(user.isAccountLocked(pastLockTime)).toBe(false);
    });

    test('should determine when to lock account', () => {
      const user = new User(validUserData);
      
      expect(user.shouldLockAccount(5)).toBe(false);
      
      for (let i = 0; i < 5; i++) {
        user.incrementLoginAttempts();
      }
      
      expect(user.shouldLockAccount(5)).toBe(true);
    });
  });

  describe('User activation/deactivation', () => {
    test('should deactivate user', () => {
      const user = new User(validUserData);
      
      user.deactivate();
      expect(user.isActive).toBe(false);
    });

    test('should activate user and reset login attempts', () => {
      const user = new User(validUserData);
      user.incrementLoginAttempts();
      user.lockAccount(1000);
      user.deactivate();
      
      user.activate();
      
      expect(user.isActive).toBe(true);
      expect(user.loginAttempts).toBe(0);
      expect(user.lockedUntil).toBeNull();
    });
  });

  describe('Login tracking', () => {
    test('should update last login and reset attempts', () => {
      const user = new User(validUserData);
      const loginTime = new Date();
      user.incrementLoginAttempts();
      
      user.updateLastLogin(loginTime);
      
      expect(user.lastLoginAt).toBe(loginTime);
      expect(user.loginAttempts).toBe(0);
    });
  });

  describe('Password management', () => {
    test('should change password', () => {
      const user = new User(validUserData);
      const newPassword = HashedPassword.create('hashed:newpassword');
      
      user.changePassword(newPassword);
      
      expect(user.hashedPassword).toBe(newPassword);
    });

    test('debería lanzar error para tipo de contraseña inválido', () => {
      const user = new User(validUserData);
      
      expect(() => user.changePassword('plaintext')).toThrow('La contraseña debe ser una instancia de HashedPassword');
    });
  });

  describe('Profile updates', () => {
    test('should update name', () => {
      const user = new User(validUserData);
      
      user.updateProfile('New Name');
      
      expect(user.name).toBe('New Name');
    });

    test('should update email', () => {
      const user = new User(validUserData);
      const newEmail = 'newemail@uct.cl';
      
      user.updateProfile(null, newEmail);
      
      expect(user.email.value).toBe(newEmail);
    });

    test('debería validar nombre durante actualización', () => {
      const user = new User(validUserData);
      
      expect(() => user.updateProfile('A')).toThrow('El nombre debe tener al menos 2 caracteres');
    });
  });

  describe('Persistence methods', () => {
    test('should convert to persistence format', () => {
      const user = new User({ ...validUserData, id: '123' });
      const persistenceData = user.toPersistence();
      
      expect(persistenceData).toEqual({
        id: '123',
        email: 'test@uct.cl',
        hashedPassword: 'hashed:password123',
        name: 'Test User',
        role: 'alumno',
        isActive: true,
        createdAt: user.createdAt,
        lastLoginAt: null,
        loginAttempts: 0,
        lockedUntil: null
      });
    });

    test('should create from persistence data', () => {
      const persistenceData = {
        id: '123',
        email: 'test@uct.cl',
        hashedPassword: 'hashed:password123',
        name: 'Test User',
        role: 'alumno',
        isActive: true,
        createdAt: new Date(),
        lastLoginAt: null,
        loginAttempts: 0,
        lockedUntil: null
      };
      
      const user = User.fromPersistence(persistenceData);
      
      expect(user.id).toBe('123');
      expect(user.name).toBe('Test User');
      expect(user.email.value).toBe('test@uct.cl');
    });
  });

  describe('User equality', () => {
    test('should be equal based on ID', () => {
      const user1 = new User({ ...validUserData, id: '123' });
      const user2 = new User({ ...validUserData, id: '123', name: 'Different Name' });
      
      expect(user1.equals(user2)).toBe(true);
    });

    test('should not be equal with different IDs', () => {
      const user1 = new User({ ...validUserData, id: '123' });
      const user2 = new User({ ...validUserData, id: '456' });
      
      expect(user1.equals(user2)).toBe(false);
    });

    test('should not be equal to non-User object', () => {
      const user = new User({ ...validUserData, id: '123' });
      
      expect(user.equals('not a user')).toBe(false);
    });
  });
});
