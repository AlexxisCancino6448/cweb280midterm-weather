// test bootstrap: run in memory DB for tests
// jest will run this file if imported by tests, individual tests call ensureSchema to create tables
process.env.NODE_ENV = 'test';
process.env.DATABASE_FILENAME = ':memory:';
