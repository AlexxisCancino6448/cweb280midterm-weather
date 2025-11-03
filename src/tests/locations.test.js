// basic saved locations CRUD tests and uses in memory DB via migrations in setup

const request = require('supertest');
const app = require('../app');
const { knex } = require('../db');

let token;
let createdId;

beforeAll(async () => {
  await require('../migrations/ensureSchema');

  await request(app).post('/api/auth/register').send({
    username: 'alice',
    email: 'alice@example.com',
    password: 'password123'
  });

  const res = await request(app).post('/api/auth/login').send({
    email: 'alice@example.com',
    password: 'password123'
  });
  token = res.body.data.token;
});


afterAll(async () => {
  await knex.destroy();
});

test('POST /api/locations creates a saved location', async () => {
  const res = await request(app)
    .post('/api/locations')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Work', query: 'Saskatoon, SK' });

  expect(res.statusCode).toBe(201);
  expect(res.body.data.name).toBe('Work');
  createdId = res.body.data.id;
});

test('GET /api/locations returns list containing created item', async () => {
  const res = await request(app).get('/api/locations').set('Authorization', `Bearer ${token}`);
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body.data)).toBe(true);
  expect(res.body.data.find(i => i.id === createdId)).toBeTruthy();
});

test('DELETE /api/locations/:id deletes the item', async () => {
  const res = await request(app).delete(`/api/locations/${createdId}`).set('Authorization', `Bearer ${token}`);
  expect(res.statusCode).toBe(204);
});
