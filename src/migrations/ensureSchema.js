// programmatic migration runner that creates the required tables if they do not exist
const { knex, dbFile } = require('../db');

async function createSchema() {
  // users
  const hasUsers = await knex.schema.hasTable('users');
  if (!hasUsers) {
    await knex.schema.createTable('users', (t) => {
      t.uuid('id').primary();
      t.string('username').notNullable();
      t.string('email').notNullable().unique();
      t.string('password_hash').notNullable();
      t.string('default_location');
      t.string('units').notNullable().defaultTo('m');
      t.timestamp('created_at').defaultTo(knex.fn.now());
    });
    console.log('Created table: users');
  }

  // saved_locations
  const hasSaved = await knex.schema.hasTable('saved_locations');
  if (!hasSaved) {
    await knex.schema.createTable('saved_locations', (t) => {
      t.uuid('id').primary();
      t.uuid('user_id').notNullable();
      t.string('name').notNullable();
      t.string('query').notNullable();
      t.text('notes');
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    });
    console.log('created table: saved_locations');
  }

  // weather_snapshots
  const hasSnapshots = await knex.schema.hasTable('weather_snapshots');
  if (!hasSnapshots) {
    await knex.schema.createTable('weather_snapshots', (t) => {
      t.uuid('id').primary();
      t.string('location_query').notNullable();
      t.timestamp('fetched_at').defaultTo(knex.fn.now());
      t.integer('temperature');
      t.integer('humidity');
      t.integer('wind_speed');
      t.integer('pressure');
      t.integer('visibility');
      t.text('raw_json');
    });
    console.log('created table: weather_snapshots');
  }
}

createSchema()
  .then(() => {
    console.log('schema ensured. DB file:', dbFile || '(memory)');
    // keep connection open for in memory or worker local test DB files so the schema persists
    const isTransient =
      !dbFile ||
      dbFile === ':memory:' ||
      (typeof dbFile === 'string' && dbFile.includes('test_') && dbFile.endsWith('.sqlite')) ||
      (typeof dbFile === 'string' && dbFile.startsWith('file:') && dbFile.includes('mode=memory'));
    if (isTransient) {
      console.log('transient DB detected, keeping migration connection open for this process.');
      return;
    }
    // for persistent DB files destroy the migration knex to avoid resources being leaked.
    return knex.destroy();
  })
  .catch((err) => {
    // log and rethrow so the caller can handle the failure.
    console.error('failed to ensure schema:', err);
    throw err;
  });
