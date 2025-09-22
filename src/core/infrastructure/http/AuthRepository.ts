import { IAuthRepository } from '@/core/application/ports/IAuthRepository';
import { IHttpClient } from '@/core/application/ports/IHttpClient';
import { User } from '@/core/domain/entities/User';
import { LoginDTO } from '@/core/application/dto/LoginDTO';
import { RegisterDTO } from '@/core/application/dto/RegisterDTO';

export class AuthRepository implements IAuthRepository {
  constructor(private httpClient: IHttpClient) {}

  async login(credentials: LoginDTO): Promise<{ user: User; expiresIn: number }> {
    const response = await this.httpClient.post<any>('/auth/login', credentials);
    
    return {
      user: User.fromJSON(response.user),
      expiresIn: response.expiresIn || 900, // 15 minutos default
    };
  }

  async logout(): Promise<void> {
    await this.httpClient.post('/auth/logout');
  }

  async refresh(): Promise<{ user: User; expiresIn: number }> {
    const response = await this.httpClient.post<any>('/auth/refresh');
    
    return {
      user: User.fromJSON(response.user),
      expiresIn: response.expiresIn || 900,
    };
  }

  async register(data: RegisterDTO): Promise<User> {
    const response = await this.httpClient.post<any>('/auth/register', data);
    return User.fromJSON(response.user);
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.httpClient.get<any>('/auth/profile');
      return User.fromJSON(response.user);
    } catch {
      return null;
    }
  }
}
