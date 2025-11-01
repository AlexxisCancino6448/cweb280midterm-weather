// runs once before all test suites. ensures schema exists for the in memory DB.
module.exports = async () => {
  // require the migration which will create tables and keep the migration connection open for in memory DB
  await require('../migrations/ensureSchema');
};