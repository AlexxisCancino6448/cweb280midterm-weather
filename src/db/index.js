// programmatic knex SQLite client that uses pool.afterCreate to enable PRAGMA foreign_keys = ON
const path = require('path');
const knexLib = require('knex');

const dbFile = process.env.DATABASE_FILENAME || './data/dev.sqlite';

const knex = knexLib({
  client: 'sqlite3',
  connection: { filename: dbFile },
  useNullAsDefault: true,
  pool: {
    min: 1,
    max: 1,
    afterCreate: (conn, done) => {
      conn.run('PRAGMA foreign_keys = ON', (err) => done(err, conn));
    }
  }
});

module.exports = { knex, dbFile };