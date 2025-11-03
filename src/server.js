// bootstraps server using config kept small to support tests that import app without starting server
const app = require('./app');
const config = require('./config');

const port = config.port;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
