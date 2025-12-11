// simple seeding code for development it creates a user and saved location for example purposes

const bcrypt = require('bcryptjs');
const { knex } = require('../src/db');
const { v4: uuidv4 } = require('uuid');

async function seed() {
  try {
    const passwordHash = await bcrypt.hash('password123', 10);
    const userId = uuidv4();

    await knex('users').insert({
      id: userId,
      username: 'seeduser',
      email: 'seed@example.com',
      password_hash: passwordHash,
      default_location: 'Regina, SK',
      units: 'm'
    });

    await knex('saved_locations').insert({
      id: uuidv4(),
      user_id: userId,
      name: 'Home',
      query: 'Regina, SK',
      notes: 'seed location'
    });

    console.log('seeding complete');
  } catch (err) {
    console.error('seeding failed', err);
  } finally {
    await knex.destroy();
  }
}

seed();
