// CRUD helpers for saved_locations getById returns userId for ownership enforcement
const { knex } = require('../db');
const { v4: uuidv4 } = require('uuid');

const TABLE = 'saved_locations';

async function create({ userId, name, query, notes = null }) {
  const id = uuidv4();
  await knex(TABLE).insert({
    id,
    user_id: userId,
    name,
    query,
    notes
  });
  return getById(id);
}

async function listByUser(userId) {
  return knex(TABLE).where({ user_id: userId }).select('id', 'name', 'query', 'notes', 'created_at as createdAt');
}

async function getById(id) {
  const row = await knex(TABLE).where({ id }).first();
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    query: row.query,
    notes: row.notes,
    createdAt: row.created_at
  };
}

async function update(id, updates) {
  const allowed = {};
  if (updates.name !== undefined) allowed.name = updates.name;
  if (updates.query !== undefined) allowed.query = updates.query;
  if (updates.notes !== undefined) allowed.notes = updates.notes;
  await knex(TABLE).where({ id }).update(allowed);
  return getById(id);
}

async function remove(id) {
  return knex(TABLE).where({ id }).del();
}

module.exports = { create, listByUser, getById, update, remove };
