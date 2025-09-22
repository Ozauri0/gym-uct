import { IAuthRepository } from '../ports/IAuthRepository';
import { ITokenStorage } from '../ports/ITokenStorage';
import { User } from '@/core/domain/entities/User';

export class GetCurrentUserUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private tokenStorage: ITokenStorage
  ) {}

  async execute(): Promise<User | null> {
    // Verificar si hay tokens válidos
    if (!this.tokenStorage.isAuthenticated()) {
      return null;
    }

    try {
      // Obtener usuario actual del backend
      const user = await this.authRepository.getCurrentUser();
      return user;
    } catch (error) {
      // Si falla, limpiar tokens
      this.tokenStorage.clearTokens();
      return null;
    }
  }
}
