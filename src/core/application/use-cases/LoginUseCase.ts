import { IAuthRepository } from '../ports/IAuthRepository';
import { ITokenStorage } from '../ports/ITokenStorage';
import { LoginDTO } from '../dto/LoginDTO';
import { User } from '@/core/domain/entities/User';
import { AuthTokens } from '@/core/domain/value-objects/AuthTokens';
import { AuthError } from '@/core/domain/errors/AuthError';

export class LoginUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private tokenStorage: ITokenStorage
  ) {}

  async execute(credentials: LoginDTO): Promise<User> {
    try {
      this.validateCredentials(credentials);
      const { user, expiresIn } = await this.authRepository.login(credentials);
      const expiresAt = new Date(Date.now() + expiresIn * 1000);
      const tokens = new AuthTokens('', expiresAt);
      this.tokenStorage.setTokens(tokens);
      return user;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw AuthError.invalidCredentials();
      }
      if (error.response?.status === 423) {
        throw AuthError.accountLocked();
      }
      throw error;
    }
  }

  private validateCredentials(credentials: LoginDTO): void {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email y contraseña son requeridos');
    }
    const emailRegex = /@(uct\.cl|alu\.uct\.cl)$/;
    if (!emailRegex.test(credentials.email)) {
      throw new Error('El email debe ser del dominio UCT');
    }
  }
}
