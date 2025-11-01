// stores snapshots of fetched weather 
const { knex } = require('../db');
const { v4: uuidv4 } = require('uuid');

const TABLE = 'weather_snapshots';

async function create({ locationQuery, temperature = null, humidity = null, windSpeed = null, pressure = null, visibility = null, rawJson = null }) {
  const id = uuidv4();
  await knex(TABLE).insert({
    id,
    location_query: locationQuery,
    temperature,
    humidity,
    wind_speed: windSpeed,
    pressure,
    visibility,
    raw_json: rawJson ? JSON.stringify(rawJson) : null
  });
  return getById(id);
}

async function listRecentByQuery(locationQuery, limit = 10) {
  return knex(TABLE)
    .where({ location_query: locationQuery })
    .orderBy('fetched_at', 'desc')
    .limit(limit)
    .select('id', 'location_query as locationQuery', 'fetched_at as fetchedAt', 'temperature', 'humidity', 'wind_speed as windSpeed', 'pressure', 'visibility');
}

async function getById(id) {
  const row = await knex(TABLE).where({ id }).first();
  if (!row) return null;
  return {
    id: row.id,
    locationQuery: row.location_query,
    fetchedAt: row.fetched_at,
    temperature: row.temperature,
    humidity: row.humidity,
    windSpeed: row.wind_speed,
    pressure: row.pressure,
    visibility: row.visibility,
    rawJson: row.raw_json ? JSON.parse(row.raw_json) : null
  };
}

module.exports = { create, listRecentByQuery, getById };
