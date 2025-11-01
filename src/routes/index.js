// aggregates route modules
const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./users.routes');
const locationRoutes = require('./locations.routes');
const weatherRoutes = require('./snapshots.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/locations', locationRoutes);
router.use('/weather', weatherRoutes);

module.exports = router;
