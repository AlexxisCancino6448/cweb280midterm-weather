// express app bootstrap: global middleware, routes mounting, centralized error handler
// rubric uses helmet, cors and express.json for security and parsing
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// security and logging middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// health route useful for quick verification
app.get('/', (req, res) => res.json({ success: true, message: 'cweb280midterm-weather API running' }));

// mount API routes under /api 
app.use('/api', routes);

// 404 handler returns JSON
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

// centralized error handling to keep controllers thin and consistent
app.use(errorHandler);

module.exports = app;
