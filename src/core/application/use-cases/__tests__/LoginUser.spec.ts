import { LoginUser } from '../LoginUser';
import { AuthService } from '../../ports/AuthService';

describe('LoginUser', () => {
  it('returns token for valid credentials', async () => {
    const mockAuth: AuthService = {
      login: async (email, password) =>
        email === 'a@a.com' && password === '1234'
          ? { token: 'jwt-token' }
          : { error: 'Invalid credentials' },
    };
    const useCase = new LoginUser(mockAuth);
    const result = await useCase.execute('a@a.com', '1234');
    expect('token' in result).toBe(true);
  });

  it('returns error for invalid credentials', async () => {
    const mockAuth: AuthService = {
      login: async () => ({ error: 'Invalid credentials' }),
    };
    const useCase = new LoginUser(mockAuth);
    const result = await useCase.execute('a@a.com', 'wrong');
    expect('error' in result).toBe(true);
  });
});
