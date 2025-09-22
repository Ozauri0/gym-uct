import { AuthService } from '../ports/AuthService';

export class LoginUser {
  constructor(private readonly authService: AuthService) {}

  async execute(email: string, password: string) {
    return this.authService.login(email, password);
  }
}
