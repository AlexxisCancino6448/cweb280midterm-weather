// run before modules load so it forces tests to use in memory DB and test JWT secret
process.env.NODE_ENV = 'test';
process.env.DATABASE_FILENAME = process.env.DATABASE_FILENAME || ':memory:';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret';
require('../migrations/ensureSchema');