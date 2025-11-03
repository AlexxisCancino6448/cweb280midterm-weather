// basic user profile tests. uses in memory DB if tests set DATABASE_FILENAME=':memory:'
const request = require('supertest');
const app = require('../app');
const { knex } = require('../db');

let token;

beforeAll(async () => {
  // ensure schema in memory DB
  await require('../migrations/ensureSchema');

  // register and login as a user to get a token
  await request(app).post('/api/auth/register').send({
    username: 'alex',
    email: 'alex@example.com',
    password: 'password123'
  });

  const res = await request(app).post('/api/auth/login').send({
    email: 'alex@example.com',
    password: 'password123'
  });
  token = res.body.data.token;
});


afterAll(async () => {
  await knex.destroy();
});

test('GET /api/users/me returns profile (protected)', async () => {
  const res = await request(app).get('/api/users/me').set('Authorization', `Bearer ${token}`);
  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.data.email).toBe('alex@example.com');
});

test('PUT /api/users/me updates allowed fields', async () => {
  const res = await request(app)
    .put('/api/users/me')
    .set('Authorization', `Bearer ${token}`)
    .send({ username: 'alex', units: 'c' });
  expect(res.statusCode).toBe(200);
  expect(res.body.data.username).toBe('alex');
  expect(res.body.data.units).toBe('c');
});
