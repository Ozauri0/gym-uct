import { IAuthRepository } from '../ports/IAuthRepository';
import { ITokenStorage } from '../ports/ITokenStorage';
import { User } from '@/core/domain/entities/User';
import { AuthTokens } from '@/core/domain/value-objects/AuthTokens';

export class RefreshSessionUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private tokenStorage: ITokenStorage
  ) {}

  async execute(): Promise<User> {
    try {
      const { user, expiresIn } = await this.authRepository.refresh();
      const expiresAt = new Date(Date.now() + expiresIn * 1000);
      const tokens = new AuthTokens('', expiresAt);
      this.tokenStorage.setTokens(tokens);
      return user;
    } catch (error) {
      this.tokenStorage.clearTokens();
      throw error;
    }
  }
}
