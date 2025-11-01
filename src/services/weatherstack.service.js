// calls Weatherstack API and stores snapshot in DB 
const axios = require('axios');
const config = require('../config');
const snapshotModel = require('../models/weatherSnapshot.model');

async function fetchAndSaveSnapshot({ query, units = 'm', requestedBy = null }) {
  if (!query) {
    const err = new Error('Missing query');
    err.status = 422;
    throw err;
  }
  const params = {
    access_key: config.weatherstackKey,
    query,
    units
  };
  const url = `http://api.weatherstack.com/current`;

  // sests must mock axios.get to avoid network calls and to keep results deterministic 
  const resp = await axios.get(url, { params });
  const data = resp.data;

  if (!data || !data.current) {
    const err = new Error('Unexpected weather API response');
    err.status = 502;
    throw err;
  }

  const mapped = {
    locationQuery: query,
    temperature: data.current.temperature ?? null,
    humidity: data.current.humidity ?? null,
    windSpeed: data.current.wind_speed ?? null,
    pressure: data.current.pressure ?? null,
    visibility: data.current.visibility ?? null,
    rawJson: data
  };

  const saved = await snapshotModel.create(mapped);
  return { api: mapped, saved };
}

async function listSnapshots(queryFilter) {
  if (queryFilter) {
    return snapshotModel.listRecentByQuery(queryFilter, 20);
  }
  // if there is no filter return empty or recent overall 
  return [];
}

module.exports = { fetchAndSaveSnapshot, listSnapshots };
