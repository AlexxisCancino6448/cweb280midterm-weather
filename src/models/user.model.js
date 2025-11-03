// simple data access layer for users table. keeps SQL centralized 
const { knex } = require('../db');
const { v4: uuidv4 } = require('uuid');

const TABLE = 'users';

async function create({ username, email, passwordHash, defaultLocation = null, units = 'c' }) {
  const id = uuidv4();
  await knex(TABLE).insert({
    id,
    username,
    email,
    password_hash: passwordHash,
    default_location: defaultLocation,
    units
  });
  return findById(id);
}

// findById returns user object without password_hash to avoid accidental leaks
async function findById(id) {
  const row = await knex(TABLE).where({ id }).first();
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    defaultLocation: row.default_location,
    units: row.units,
    createdAt: row.created_at
  };
}

// findByEmail used internally by auth, returns raw DB row to enable password verification
async function findByEmail(email) {
  return knex(TABLE).where({ email }).first();
}

async function update(id, changes) {
  const allowed = {};
  if (changes.username !== undefined) allowed.username = changes.username;
  if (changes.defaultLocation !== undefined) allowed.default_location = changes.defaultLocation;
  if (changes.units !== undefined) allowed.units = changes.units;
  await knex(TABLE).where({ id }).update(allowed);
  return findById(id);
}

async function remove(id) {
  return knex(TABLE).where({ id }).del();
}

module.exports = { create, findById, findByEmail, update, remove };
 