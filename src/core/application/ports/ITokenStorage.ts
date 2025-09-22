import { AuthTokens } from '@/core/domain/value-objects/AuthTokens';

export interface ITokenStorage {
  setTokens(tokens: AuthTokens): void;
  getTokens(): AuthTokens | null;
  clearTokens(): void;
  isAuthenticated(): boolean;
}
