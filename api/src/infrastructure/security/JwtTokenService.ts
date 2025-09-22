import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../../config/env';

export interface JwtClaims {
  sub: string;
  email: string;
  role?: string;
  jti?: string;
}

export class JwtTokenService {
  createAccessToken(claims: JwtClaims): string {
    return jwt.sign(
      { sub: claims.sub, email: claims.email, role: claims.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );
  }

  createRefreshToken(claims: JwtClaims): { token: string; jti: string } {
    const jti = uuidv4();
    const token = jwt.sign(
      { sub: claims.sub, email: claims.email, role: claims.role, jti },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
    );
    return { token, jti };
  }

  verifyAccess(token: string): JwtClaims | null {
    try {
      return jwt.verify(token, env.JWT_SECRET) as JwtClaims;
    } catch {
      return null;
    }
  }

  verifyRefresh(token: string): JwtClaims | null {
    try {
      return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtClaims;
    } catch {
      return null;
    }
  }
}
