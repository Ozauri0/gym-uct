import dotenv from 'dotenv';
import type { StringValue } from 'ms';

dotenv.config();

interface EnvConfig {
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRES_IN: StringValue;
  JWT_REFRESH_EXPIRES_IN: StringValue;
  PORT: number;
  CORS_ORIGIN: string;
  RATELIMIT_AUTH_MAX: number;
  RATELIMIT_AUTH_WINDOW: StringValue;
}

const durationPattern = /^\d+(?:\s*[a-zA-Z]+)?$/;

const toString = (value: string | undefined, fallback: string): string => {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : fallback;
};

const toNumber = (value: string | undefined, fallback: number, varName: string): number => {
  if (value === undefined || value.trim() === '') {
    return fallback;
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${varName} must be a number, received "${value}".`);
  }
  return parsed;
};

const toDuration = (value: string | undefined, fallback: StringValue, varName: string): StringValue => {
  if (value === undefined || value.trim() === '') {
    return fallback;
  }
  const normalized = value.trim();
  if (!durationPattern.test(normalized)) {
    throw new Error(
      `Environment variable ${varName} must be a duration like "15m" or "1 hour", received "${value}".`
    );
  }
  return normalized as StringValue;
};

export const env: EnvConfig = {
  MONGO_URI: toString(process.env.MONGO_URI, ''),
  JWT_SECRET: toString(process.env.JWT_SECRET, 'dev-secret'),
  JWT_REFRESH_SECRET: toString(process.env.JWT_REFRESH_SECRET, 'dev-refresh-secret'),
  JWT_EXPIRES_IN: toDuration(process.env.JWT_EXPIRES_IN, '15m', 'JWT_EXPIRES_IN'),
  JWT_REFRESH_EXPIRES_IN: toDuration(process.env.JWT_REFRESH_EXPIRES_IN, '7d', 'JWT_REFRESH_EXPIRES_IN'),
  PORT: toNumber(process.env.PORT, 4000, 'PORT'),
  CORS_ORIGIN: toString(process.env.CORS_ORIGIN, 'http://localhost:3000'),
  RATELIMIT_AUTH_MAX: toNumber(process.env.RATELIMIT_AUTH_MAX, 10, 'RATELIMIT_AUTH_MAX'),
  RATELIMIT_AUTH_WINDOW: toDuration(process.env.RATELIMIT_AUTH_WINDOW, '1 minute', 'RATELIMIT_AUTH_WINDOW'),
};
