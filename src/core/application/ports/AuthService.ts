export interface AuthService {
  login(email: string, password: string): Promise<{ token: string } | { error: string }>;
}
