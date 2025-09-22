const Email = require('../../src/domain/value-objects/Email');

describe('Email Value Object', () => {
  describe('Creación válida de email', () => {
    test('debería crear email con formato válido UCT', () => {
      const email = Email.create('test@uct.cl');
      expect(email.value).toBe('test@uct.cl');
    });

    test('debería crear email con formato válido para alumnos', () => {
      const email = Email.create('student@alu.uct.cl');
      expect(email.value).toBe('student@alu.uct.cl');
    });

    test('debería normalizar email a minúsculas', () => {
      const email = Email.create('TEST@UCT.CL');
      expect(email.value).toBe('test@uct.cl');
    });

    test('debería limpiar espacios en blanco', () => {
      const email = Email.create('  test@uct.cl  ');
      expect(email.value).toBe('test@uct.cl');
    });
  });

  describe('Validación de email inválido', () => {
    test('debería lanzar error para email nulo', () => {
      expect(() => Email.create(null)).toThrow('El email es requerido');
    });

    test('debería lanzar error para email indefinido', () => {
      expect(() => Email.create(undefined)).toThrow('El email es requerido');
    });

    test('debería lanzar error para email no string', () => {
      expect(() => Email.create(123)).toThrow('El email debe ser una cadena de texto');
    });

    test('debería lanzar error para email vacío', () => {
      expect(() => Email.create('')).toThrow('El email no puede estar vacío');
    });

    test('debería lanzar error para email sin @', () => {
      expect(() => Email.create('testmail.com')).toThrow('Formato de email inválido');
    });

    test('debería lanzar error para email sin dominio', () => {
      expect(() => Email.create('test@')).toThrow('Formato de email inválido');
    });

    test('debería lanzar error para email sin parte local', () => {
      expect(() => Email.create('@uct.cl')).toThrow('Formato de email inválido');
    });

    test('debería lanzar error para email demasiado largo', () => {
      const longEmail = 'a'.repeat(250) + '@uct.cl';
      expect(() => Email.create(longEmail)).toThrow('El email es demasiado largo');
    });

    test('debería lanzar error para dominio no UCT', () => {
      expect(() => Email.create('test@gmail.com')).toThrow('El email debe ser de dominio UCT (@uct.cl o @alu.uct.cl)');
    });

    test('debería lanzar error para dominio UCT inválido', () => {
      expect(() => Email.create('test@uct.com')).toThrow('El email debe ser de dominio UCT (@uct.cl o @alu.uct.cl)');
    });
  });

  describe('Igualdad de emails', () => {
    test('debería ser igual al mismo email', () => {
      const email1 = Email.create('test@uct.cl');
      const email2 = Email.create('test@uct.cl');
      expect(email1.equals(email2)).toBe(true);
    });

    test('debería ser igual sin importar mayúsculas/minúsculas', () => {
      const email1 = Email.create('test@uct.cl');
      const email2 = Email.create('TEST@UCT.CL');
      expect(email1.equals(email2)).toBe(true);
    });

    test('no debería ser igual a un email diferente', () => {
      const email1 = Email.create('test1@uct.cl');
      const email2 = Email.create('test2@uct.cl');
      expect(email1.equals(email2)).toBe(false);
    });

    test('no debería ser igual a un objeto que no es Email', () => {
      const email = Email.create('test@uct.cl');
      expect(email.equals('test@uct.cl')).toBe(false);
    });
  });

  describe('Inmutabilidad del email', () => {
    test('debería ser inmutable', () => {
      const email = Email.create('test@uct.cl');
      
      // En JavaScript, Object.freeze hace que el objeto sea inmutable
      // Pero no lanza error al intentar modificar, simplemente ignora la operación
      const originalValue = email.value;
      
      // Intentar modificar (debería ser ignorado en modo no-strict)
      try {
        email._value = 'changed@uct.cl';
      } catch (e) {
        // En strict mode podría lanzar error
      }
      
      // El valor no debería haber cambiado
      expect(email.value).toBe(originalValue);
      expect(email.value).toBe('test@uct.cl');
    });
  });

  describe('Representación como string del email', () => {
    test('debería retornar el valor del email como string', () => {
      const email = Email.create('test@uct.cl');
      expect(email.toString()).toBe('test@uct.cl');
    });
  });
});
