import { FastifyRequest, FastifyReply } from 'fastify';
import { MongoUserRepository } from '../../infrastructure/db/repos/MongoUserRepository';
import { MongoTokenRepository } from '../../infrastructure/db/repos/MongoTokenRepository';
import { BcryptHasher } from '../../infrastructure/security/BcryptHasher';
import { JwtTokenService } from '../../infrastructure/security/JwtTokenService';
import { UserModel } from '../../infrastructure/db/models/User';
import { Types } from 'mongoose';

const userRepo = new MongoUserRepository();
const tokenRepo = new MongoTokenRepository();
const hasher = new BcryptHasher();
const jwtService = new JwtTokenService();

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { email, password, name } = request.body as any;
  if (!email || !password || !name) return reply.status(400).send({ error: 'Missing fields' });
  const exists = await userRepo.findByEmail(email);
  if (exists) return reply.status(409).send({ error: 'Email already registered' });
  const passwordHash = await hasher.hash(password);
  const user = await userRepo.create({ email, passwordHash, name });
  return reply.status(201).send({ id: user.id, email: user.email, name: user.name });
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
  const { email, password } = request.body as any;
  const user = await userRepo.findByEmail(email);
  if (!user) return reply.status(401).send({ error: 'Invalid credentials' });
  const valid = await hasher.compare(password, user.passwordHash);
  if (!valid) return reply.status(401).send({ error: 'Invalid credentials' });
  const accessToken = jwtService.createAccessToken({ sub: user.id, email: user.email });
  const { token: refreshToken, jti } = jwtService.createRefreshToken({ sub: user.id, email: user.email });
  await tokenRepo.storeRefreshToken({ userId: new Types.ObjectId(user.id), jti, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
  reply.setCookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'lax',
    path: '/auth/refresh',
    maxAge: 7 * 24 * 60 * 60,
  });
  return reply.send({ accessToken });
}

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  const refreshToken = request.cookies.refreshToken;
  if (!refreshToken) return reply.status(401).send({ error: 'No refresh token' });
  const claims = jwtService.verifyRefresh(refreshToken);
  if (!claims || !claims.jti) return reply.status(401).send({ error: 'Invalid refresh token' });
  const exists = await tokenRepo.exists(claims.jti);
  if (!exists) return reply.status(401).send({ error: 'Refresh token revoked' });
  const user = await userRepo.findById(claims.sub);
  if (!user) return reply.status(401).send({ error: 'User not found' });
  const accessToken = jwtService.createAccessToken({ sub: user.id, email: user.email });
  return reply.send({ accessToken });
}

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  const refreshToken = request.cookies.refreshToken;
  if (refreshToken) {
    const claims = jwtService.verifyRefresh(refreshToken);
    if (claims && claims.jti) {
      await tokenRepo.removeByJti(claims.jti);
    }
  }
  reply.clearCookie('refreshToken', { path: '/auth/refresh' });
  return reply.send({ success: true });
}
