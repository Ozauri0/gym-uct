import type { FastifyInstance } from 'fastify';
import rateLimit from '@fastify/rate-limit';
import * as authController from './auth.controllers';
import { env } from '../../config/env';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.register(rateLimit, {
    max: env.RATELIMIT_AUTH_MAX,
    timeWindow: env.RATELIMIT_AUTH_WINDOW,
  });

  fastify.post('/register', authController.register);
  fastify.post('/login', authController.login);
  fastify.post('/refresh', authController.refresh);
  fastify.post('/logout', authController.logout);
}
