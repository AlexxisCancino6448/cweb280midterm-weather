// tests for weather snapshot flow. mocks axios to avoid real HTTP calls
// demonstrates that fetch endpoint stores a snapshot and returns mapped data

const request = require('supertest');
const app = require('../app');
const { knex } = require('../db');
const axios = require('axios');

jest.mock('axios');

beforeAll(async () => {
  await require('../migrations/ensureSchema');
});

afterAll(async () => {
  await knex.destroy();
});

test('GET /api/weather stores snapshot and returns mapped data', async () => {
  // mock Weatherstack response shape
  axios.get.mockResolvedValue({
    data: {
      request: { query: 'Regina' },
      location: { name: 'Regina' },
      current: {
        temperature: 10,
        humidity: 50,
        wind_speed: 5,
        pressure: 1013,
        visibility: 10
      }
    }
  });

  const res = await request(app).get('/api/weather').query({ query: 'Regina', units: 'm' });
  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
  expect(res.body.data.saved).toBeDefined();
  expect(res.body.data.api.temperature).toBe(10);

  // verify snapshot exists in the DB
  const rows = await knex('weather_snapshots').where({ location_query: 'Regina' });
  expect(rows.length).toBeGreaterThan(0);
});
