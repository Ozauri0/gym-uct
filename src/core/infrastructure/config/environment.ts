export const environment = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  API_TIMEOUT: 30000,
  REFRESH_THRESHOLD: 60000, // 1 minuto antes de expirar
  APP_NAME: 'Gym UCT',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const;
