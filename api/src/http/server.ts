import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import { env } from '../config/env';
import { connectMongo } from '../infrastructure/db/mongo';
import authRoutes from './routes/auth.routes.js';

const fastify = Fastify();

fastify.register(cors, { origin: env.CORS_ORIGIN, credentials: true });
fastify.register(helmet);
fastify.register(cookie, { secret: env.JWT_SECRET });
fastify.register(rateLimit, { global: true, max: 100, timeWindow: '1 minute' });

fastify.register(authRoutes, { prefix: '/auth' });

connectMongo().then(() => {
  fastify.listen({ port: env.PORT, host: '0.0.0.0' }, (err: Error | null, address: string) => {
    if (err) throw err;
    console.log(`Server running at ${address}`);
  });
});

export default fastify;
