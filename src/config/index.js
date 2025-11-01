// centralized configurations for reading environment variables so it ensures testability and a has single place to adjust the secrets

module.exports = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseFilename: process.env.DATABASE_FILENAME || './data/dev.sqlite',
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  weatherstackKey: process.env.WEATHERSTACK_KEY || ''
};
