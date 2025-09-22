import { IAuthRepository } from '../ports/IAuthRepository';
import { ITokenStorage } from '../ports/ITokenStorage';

export class LogoutUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private tokenStorage: ITokenStorage
  ) {}

  async execute(): Promise<void> {
    try {
      await this.authRepository.logout();
    } finally {
      this.tokenStorage.clearTokens();
    }
  }
}
