import { User } from '@/core/domain/entities/User';
import { LoginDTO } from '../dto/LoginDTO';
import { RegisterDTO } from '../dto/RegisterDTO';

export interface IAuthRepository {
  login(credentials: LoginDTO): Promise<{ user: User; expiresIn: number }>;
  logout(): Promise<void>;
  refresh(): Promise<{ user: User; expiresIn: number }>;
  register(data: RegisterDTO): Promise<User>;
  getCurrentUser(): Promise<User | null>;
}
