// runs in each Jest worker before modules load, creates a worker local DB file
const fs = require('fs');
const path = require('path');

process.env.NODE_ENV = 'test';

const dbDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

// deterministic file per worker
const dbFile = path.join(dbDir, `test_${process.pid}.sqlite`);

// start fresh
try { if (fs.existsSync(dbFile)) fs.unlinkSync(dbFile); } catch (e) { /* ignore */ }

process.env.DATABASE_FILENAME = dbFile;
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';

// run migrations in this same worker so worker connections share the schema
require('../../src/migrations/ensureSchema');

