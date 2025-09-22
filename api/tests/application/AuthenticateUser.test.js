const AuthenticateUser = require('../../src/application/use-cases/AuthenticateUser');
const RegisterUser = require('../../src/application/use-cases/RegisterUser');
const InMemoryUserRepository = require('../mocks/InMemoryUserRepository');
const InMemoryTokenRepository = require('../mocks/InMemoryTokenRepository');
const MockHasher = require('../mocks/MockHasher');
const MockTokenService = require('../mocks/MockTokenService');
const MockClock = require('../mocks/MockClock');

describe('AuthenticateUser Caso de Uso', () => {
  let authenticateUser;
  let registerUser;
  let userRepository;
  let tokenRepository;
  let hasher;
  let tokenService;
  let clock;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    tokenRepository = new InMemoryTokenRepository();
    hasher = new MockHasher();
    tokenService = new MockTokenService();
    clock = new MockClock();
    
    authenticateUser = new AuthenticateUser({
      userRepository,
      hasher,
      tokenService,
      tokenRepository,
      clock
    });

    registerUser = new RegisterUser({
      userRepository,
      hasher,
      clock
    });
  });

  const createTestUser = async (userData = {}) => {
    const defaultUserData = {
      email: 'test@uct.cl',
      password: 'SecurePass123!',
      name: 'Test User',
      role: 'alumno',
      ...userData
    };

    const result = await registerUser.execute(defaultUserData);
    expect(result.success).toBe(true);
    return result.user;
  };

  describe('Autenticación exitosa', () => {
    test('debería autenticar usuario con credenciales válidas', async () => {
      await createTestUser();

      const result = await authenticateUser.execute({
        email: 'test@uct.cl',
        password: 'SecurePass123!'
      });

      expect(result.success).toBe(true);
      expect(result.tokens).toBeDefined();
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
      expect(result.tokens.expiresIn).toBe('15m');
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@uct.cl');
      expect(result.user.name).toBe('Test User');
    });

    test('debería actualizar tiempo de último login', async () => {
      await createTestUser();
      const loginTime = new Date('2023-01-01T12:00:00Z');
      clock.setTime(loginTime);

      await authenticateUser.execute({
        email: 'test@uct.cl',
        password: 'SecurePass123!'
      });

      const user = await userRepository.findByEmail('test@uct.cl');
      expect(user.lastLoginAt).toEqual(loginTime);
    });

    test('debería resetear intentos de login en autenticación exitosa', async () => {
      await createTestUser();
      
      // Simular intentos fallidos previos
      const user = await userRepository.findByEmail('test@uct.cl');
      user.incrementLoginAttempts();
      user.incrementLoginAttempts();
      await userRepository.update(user);

      await authenticateUser.execute({
        email: 'test@uct.cl',
        password: 'SecurePass123!'
      });

      const updatedUser = await userRepository.findByEmail('test@uct.cl');
      expect(updatedUser.loginAttempts).toBe(0);
    });

    test('debería guardar refresh token', async () => {
      await createTestUser();

      await authenticateUser.execute({
        email: 'test@uct.cl',
        password: 'SecurePass123!'
      });

      expect(tokenRepository.getRefreshTokenCount()).toBe(1);
    });
  });

  describe('Fallos de autenticación', () => {
    test('debería fallar con email inválido', async () => {
      const result = await authenticateUser.execute({
        email: 'nonexistent@uct.cl',
        password: 'SecurePass123!'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Credenciales inválidas');
    });

    test('debería fallar con contraseña inválida', async () => {
      await createTestUser();

      const result = await authenticateUser.execute({
        email: 'test@uct.cl',
        password: 'WrongPassword123!'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Credenciales inválidas');
    });

    test('debería incrementar intentos de login en contraseña fallida', async () => {
      await createTestUser();

      await authenticateUser.execute({
        email: 'test@uct.cl',
        password: 'WrongPassword123!'
      });

      const user = await userRepository.findByEmail('test@uct.cl');
      expect(user.loginAttempts).toBe(1);
    });

    test('debería fallar con cuenta desactivada', async () => {
      await createTestUser();
      
      const user = await userRepository.findByEmail('test@uct.cl');
      user.deactivate();
      await userRepository.update(user);

      const result = await authenticateUser.execute({
        email: 'test@uct.cl',
        password: 'SecurePass123!'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('La cuenta está desactivada');
    });
  });

  describe('Mecanismo de bloqueo de cuenta', () => {
    test('debería bloquear cuenta después de máximo intentos fallidos', async () => {
      await createTestUser();

      // Hacer 5 intentos fallidos
      for (let i = 0; i < 5; i++) {
        await authenticateUser.execute({
          email: 'test@uct.cl',
          password: 'WrongPassword123!'
        });
      }

      const user = await userRepository.findByEmail('test@uct.cl');
      expect(user.isAccountLocked()).toBe(true);
      expect(user.loginAttempts).toBe(5);
    });

    test('debería fallar autenticación para cuenta bloqueada', async () => {
      await createTestUser();

      // Bloquear cuenta manualmente
      const user = await userRepository.findByEmail('test@uct.cl');
      user.lockAccount(15 * 60 * 1000); // 15 minutos
      await userRepository.update(user);

      const result = await authenticateUser.execute({
        email: 'test@uct.cl',
        password: 'SecurePass123!'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('La cuenta está bloqueada');
      expect(result.error).toContain('minutos');
    });

    test('debería permitir autenticación después de que expire el bloqueo', async () => {
      await createTestUser();

      // Bloquear cuenta
      let user = await userRepository.findByEmail('test@uct.cl');
      user.lockAccount(5 * 60 * 1000); // 5 minutos
      await userRepository.update(user);

      // Avanzar tiempo más allá del bloqueo
      clock.advanceMinutes(10);

      const result = await authenticateUser.execute({
        email: 'test@uct.cl',
        password: 'SecurePass123!'
      });

      expect(result.success).toBe(true);
    });

    test('debería proporcionar tiempo restante de bloqueo en mensaje de error', async () => {
      await createTestUser();

      // Bloquear cuenta
      const user = await userRepository.findByEmail('test@uct.cl');
      user.lockAccount(15 * 60 * 1000); // 15 minutos
      await userRepository.update(user);

      const result = await authenticateUser.execute({
        email: 'test@uct.cl',
        password: 'SecurePass123!'
      });

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/Intenta de nuevo en \d+ minutos/);
    });
  });

  describe('Validación de entrada', () => {
    test('debería fallar con email faltante', async () => {
      const result = await authenticateUser.execute({
        password: 'SecurePass123!'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('El email es requerido');
    });

    test('debería fallar con contraseña faltante', async () => {
      const result = await authenticateUser.execute({
        email: 'test@uct.cl'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('La contraseña es requerida');
    });

    test('debería fallar con email no string', async () => {
      const result = await authenticateUser.execute({
        email: 123,
        password: 'SecurePass123!'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('El email es requerido y debe ser una cadena de texto');
    });

    test('debería fallar con contraseña no string', async () => {
      const result = await authenticateUser.execute({
        email: 'test@uct.cl',
        password: 123
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('La contraseña es requerida y debe ser una cadena de texto');
    });
  });

  describe('Generación de tokens', () => {
    test('debería generar token de acceso con payload correcto', async () => {
      const user = await createTestUser({ role: 'staff' });

      const result = await authenticateUser.execute({
        email: 'test@uct.cl',
        password: 'SecurePass123!'
      });

      expect(result.success).toBe(true);
      
      // Verificar que el token se puede decodificar con el payload correcto
      const decodedToken = await tokenService.verifyAccessToken(result.tokens.accessToken);
      expect(decodedToken.userId).toBe(user.id);
      expect(decodedToken.email).toBe('test@uct.cl');
      expect(decodedToken.role).toBe('staff');
    });

    test('debería guardar refresh token con expiración correcta', async () => {
      await createTestUser();
      const currentTime = new Date('2023-01-01T12:00:00Z');
      clock.setTime(currentTime);

      await authenticateUser.execute({
        email: 'test@uct.cl',
        password: 'SecurePass123!'
      });

      const tokens = tokenRepository.getAllRefreshTokens();
      expect(tokens).toHaveLength(1);
      
      const [refreshToken, tokenData] = tokens[0];
      expect(tokenData.expiresAt.getTime()).toBe(
        currentTime.getTime() + 7 * 24 * 60 * 60 * 1000 // 7 días
      );
    });
  });

  describe('Sensibilidad a mayúsculas', () => {
    test('debería autenticar con email insensible a mayúsculas', async () => {
      await createTestUser({ email: 'test@uct.cl' });

      const result = await authenticateUser.execute({
        email: 'TEST@UCT.CL',
        password: 'SecurePass123!'
      });

      expect(result.success).toBe(true);
    });
  });
});
