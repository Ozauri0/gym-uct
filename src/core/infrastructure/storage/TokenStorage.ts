import { ITokenStorage } from '@/core/application/ports/ITokenStorage';
import { AuthTokens } from '@/core/domain/value-objects/AuthTokens';

export class TokenStorage implements ITokenStorage {
  private tokens: AuthTokens | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;

  constructor(private onTokenExpiring?: () => void) {}

  setTokens(tokens: AuthTokens): void {
    this.tokens = tokens;
    this.setupRefreshTimer(tokens);
    
    // Guardar flag en localStorage (no sensible)
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAuthenticated', 'true');
    }
  }

  getTokens(): AuthTokens | null {
    if (this.tokens && this.tokens.isExpired()) {
      this.clearTokens();
      return null;
    }
    return this.tokens;
  }

  clearTokens(): void {
    this.tokens = null;
    this.clearRefreshTimer();
    
    // Limpiar flag de localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticated');
    }
  }

  isAuthenticated(): boolean {
    // Verificar en memoria primero
    if (this.tokens && !this.tokens.isExpired()) {
      return true;
    }
    
    // Verificar flag en localStorage como fallback
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAuthenticated') === 'true';
    }
    
    return false;
  }

  private setupRefreshTimer(tokens: AuthTokens): void {
    this.clearRefreshTimer();

    if (tokens.shouldRefresh() && this.onTokenExpiring) {
      // Refrescar inmediatamente
      this.onTokenExpiring();
    } else {
      // Programar refresh para 1 minuto antes de expirar
      const timeUntilRefresh = tokens.getTimeUntilExpiry() - 60000;
      
      if (timeUntilRefresh > 0) {
        this.refreshTimer = setTimeout(() => {
          if (this.onTokenExpiring) {
            this.onTokenExpiring();
          }
        }, timeUntilRefresh);
      }
    }
  }

  private clearRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}
