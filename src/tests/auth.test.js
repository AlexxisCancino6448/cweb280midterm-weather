// minimal jest and supertest tests for auth flows, uses in memory DB and programmatic migrations
const request = require('supertest');
const app = require('../app');
const { knex } = require('../db');

beforeAll(async () => {
  await require('../migrations/ensureSchema'); // returns the migration Promise
});

afterAll(async () => {
  await knex.destroy();
});

describe('Auth', () => {
  test('register -> success', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'alex',
      email: 'alex@example.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('alex@example.com');
    expect(res.body.data.token).toBeTruthy();
  });

  test('login -> success', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'alex@example.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeTruthy();
  });
});
