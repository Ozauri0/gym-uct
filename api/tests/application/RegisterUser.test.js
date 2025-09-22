const RegisterUser = require('../../src/application/use-cases/RegisterUser');
const InMemoryUserRepository = require('../mocks/InMemoryUserRepository');
const MockHasher = require('../mocks/MockHasher');
const MockClock = require('../mocks/MockClock');

describe('RegisterUser Caso de Uso', () => {
  let registerUser;
  let userRepository;
  let hasher;
  let clock;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    hasher = new MockHasher();
    clock = new MockClock();
    
    registerUser = new RegisterUser({
      userRepository,
      hasher,
      clock
    });
  });

  describe('Registro exitoso', () => {
    test('debería registrar usuario con datos válidos', async () => {
      const userData = {
        email: 'test@alu.uct.cl',
        password: 'SecurePass123!',
        name: 'Test User',
        role: 'alumno'
      };

      const result = await registerUser.execute(userData);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@alu.uct.cl');
      expect(result.user.name).toBe('Test User');
      expect(result.user.role).toBe('alumno');
      expect(result.user.isActive).toBe(true);
      expect(result.user.id).toBeDefined();
      
      // Verificar que el usuario fue guardado
      expect(userRepository.size()).toBe(1);
    });

    test('debería usar rol por defecto cuando no se especifica', async () => {
      const userData = {
        email: 'test@uct.cl',
        password: 'SecurePass123!',
        name: 'Test User'
      };

      const result = await registerUser.execute(userData);

      expect(result.success).toBe(true);
      expect(result.user.role).toBe('alumno');
    });

    test('debería hashear la contraseña antes de guardar', async () => {
      const userData = {
        email: 'test@uct.cl',
        password: 'SecurePass123!',
        name: 'Test User'
      };

      await registerUser.execute(userData);
      
      const savedUsers = userRepository.getAll();
      expect(savedUsers[0].hashedPassword.value).toBe('hashed:SecurePass123!');
    });

    test('debería normalizar email a minúsculas', async () => {
      const userData = {
        email: 'TEST@UCT.CL',
        password: 'SecurePass123!',
        name: 'Test User'
      };

      const result = await registerUser.execute(userData);

      expect(result.success).toBe(true);
      expect(result.user.email).toBe('test@uct.cl');
    });

    test('debería aceptar email de estudiante (@alu.uct.cl)', async () => {
      const userData = {
        email: 'estudiante@alu.uct.cl',
        password: 'SecurePass123!',
        name: 'Estudiante Prueba'
      };

      const result = await registerUser.execute(userData);

      expect(result.success).toBe(true);
      expect(result.user.email).toBe('estudiante@alu.uct.cl');
    });

    test('debería aceptar email de staff (@uct.cl)', async () => {
      const userData = {
        email: 'staff@uct.cl',
        password: 'SecurePass123!',
        name: 'Staff Prueba'
      };

      const result = await registerUser.execute(userData);

      expect(result.success).toBe(true);
      expect(result.user.email).toBe('staff@uct.cl');
    });
  });

  describe('Errores de validación', () => {
    test('debería fallar con email faltante', async () => {
      const userData = {
        password: 'SecurePass123!',
        name: 'Test User'
      };

      const result = await registerUser.execute(userData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('El email es requerido');
      expect(userRepository.size()).toBe(0);
    });

    test('debería fallar con formato de email inválido', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'SecurePass123!',
        name: 'Test User'
      };

      const result = await registerUser.execute(userData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Formato de email inválido');
      expect(userRepository.size()).toBe(0);
    });

    test('debería fallar con dominio de email no UCT', async () => {
      const userData = {
        email: 'test@gmail.com',
        password: 'SecurePass123!',
        name: 'Test User'
      };

      const result = await registerUser.execute(userData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('El email debe ser de dominio UCT');
      expect(userRepository.size()).toBe(0);
    });

    test('debería fallar con contraseña faltante', async () => {
      const userData = {
        email: 'test@uct.cl',
        name: 'Test User'
      };

      const result = await registerUser.execute(userData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('La contraseña es requerida');
      expect(userRepository.size()).toBe(0);
    });

    test('debería fallar con contraseña débil', async () => {
      const userData = {
        email: 'test@uct.cl',
        password: '123',
        name: 'Test User'
      };

      const result = await registerUser.execute(userData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Validación de contraseña falló');
      expect(userRepository.size()).toBe(0);
    });

    test('debería fallar con nombre faltante', async () => {
      const userData = {
        email: 'test@uct.cl',
        password: 'SecurePass123!'
      };

      const result = await registerUser.execute(userData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('El nombre es requerido');
      expect(userRepository.size()).toBe(0);
    });

    test('debería fallar con rol inválido', async () => {
      const userData = {
        email: 'test@uct.cl',
        password: 'SecurePass123!',
        name: 'Test User',
        role: 'invalid-role'
      };

      const result = await registerUser.execute(userData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Rol inválido');
      expect(userRepository.size()).toBe(0);
    });
  });

  describe('Manejo de emails duplicados', () => {
    test('debería fallar cuando el email ya existe', async () => {
      const userData = {
        email: 'test@uct.cl',
        password: 'SecurePass123!',
        name: 'Test User'
      };

      // Registrar el primer usuario
      const firstResult = await registerUser.execute(userData);
      expect(firstResult.success).toBe(true);

      // Intentar registrar otro usuario con el mismo email
      const secondUserData = {
        ...userData,
        name: 'Another User'
      };

      const secondResult = await registerUser.execute(secondUserData);

      expect(secondResult.success).toBe(false);
      expect(secondResult.error).toContain('Ya existe un usuario con este email');
      expect(userRepository.size()).toBe(1); // Solo debe haber un usuario
    });

    test('debería fallar con emails duplicados sin importar mayúsculas/minúsculas', async () => {
      const userData1 = {
        email: 'test@uct.cl',
        password: 'SecurePass123!',
        name: 'Test User 1'
      };

      const userData2 = {
        email: 'TEST@UCT.CL',
        password: 'SecurePass123!',
        name: 'Test User 2'
      };

      await registerUser.execute(userData1);
      const result = await registerUser.execute(userData2);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Ya existe un usuario con este email');
    });
  });

  describe('Integración con reloj', () => {
    test('debería usar el reloj para timestamp de creación', async () => {
      const fixedTime = new Date('2023-01-01T12:00:00Z');
      clock.setTime(fixedTime);

      const userData = {
        email: 'test@uct.cl',
        password: 'SecurePass123!',
        name: 'Test User'
      };

      const result = await registerUser.execute(userData);

      expect(result.success).toBe(true);
      expect(result.user.createdAt).toEqual(fixedTime);
    });
  });

  describe('Validación de política de contraseñas', () => {
    const validPasswordTests = [
      { password: 'SecurePass123!', description: 'contraseña fuerte válida' },
      { password: 'MyP@ssw0rd', description: 'mayúsculas/minúsculas válidas con caracteres especiales' }
    ];

    const invalidPasswordTests = [
      { password: 'short', description: 'muy corta' },
      { password: 'nouppercase123!', description: 'sin mayúsculas' },
      { password: 'NOLOWERCASE123!', description: 'sin minúsculas' },
      { password: 'NoNumbers!', description: 'sin números' },
      { password: 'NoSpecialChars123', description: 'sin caracteres especiales' },
      { password: 'password', description: 'contraseña débil común' }
    ];

    validPasswordTests.forEach(({ password, description }) => {
      test(`debería aceptar ${description}`, async () => {
        const userData = {
          email: 'test@uct.cl',
          password,
          name: 'Test User'
        };

        const result = await registerUser.execute(userData);
        expect(result.success).toBe(true);
      });
    });

    invalidPasswordTests.forEach(({ password, description }) => {
      test(`debería rechazar ${description}`, async () => {
        const userData = {
          email: 'test@uct.cl',
          password,
          name: 'Test User'
        };

        const result = await registerUser.execute(userData);
        expect(result.success).toBe(false);
        expect(result.error).toContain('Validación de contraseña falló');
      });
    });
  });
});
