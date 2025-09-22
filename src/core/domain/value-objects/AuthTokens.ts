export class AuthTokens {
  constructor(
    public readonly accessToken: string,
    public readonly expiresAt: Date
  ) {}

  isExpired(): boolean {
    return new Date() >= this.expiresAt;
  }

  getTimeUntilExpiry(): number {
    return this.expiresAt.getTime() - Date.now();
  }

  shouldRefresh(): boolean {
    const ONE_MINUTE = 60 * 1000;
    return this.getTimeUntilExpiry() < ONE_MINUTE;
  }
}