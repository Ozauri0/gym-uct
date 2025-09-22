
import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest';
import supertest from 'supertest';
import fastifyApp from '../src/http/server';
import mongoose from 'mongoose';

let server: any;
let request: supertest.SuperTest<supertest.Test>;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/gym-uct-test');
  await fastifyApp.ready();
  server = await fastifyApp.listen({ port: 0 });
  request = supertest(server.server ? server.server : server);
});

afterAll(async () => {
  if (server && server.close) await server.close();
  await mongoose.disconnect();
});

beforeEach(async () => {
  // Limpia las colecciones relevantes antes de cada suite
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

describe('Auth E2E', () => {
  it('/auth/register → 201', async () => {
    const res = await request.post('/auth/register').send({
      email: 'test@example.com',
      password: 'Test1234!'
    });
    expect(res.status).toBe(201);
  });

  it('/auth/login → 200, access + cookie refresh', async () => {
    const res = await request.post('/auth/login').send({
      email: 'test@example.com',
      password: 'Test1234!'
    });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('/auth/refresh → 200 con cookie', async () => {
    const login = await request.post('/auth/login').send({
      email: 'test@example.com',
      password: 'Test1234!'
    });
    const cookie = login.headers['set-cookie'];
    const res = await request.post('/auth/refresh').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it('/auth/logout → 200, invalida refresh', async () => {
    const login = await request.post('/auth/login').send({
      email: 'test@example.com',
      password: 'Test1234!'
    });
    const cookie = login.headers['set-cookie'];
    const res = await request.post('/auth/logout').set('Cookie', cookie);
    expect(res.status).toBe(200);
  });
});
