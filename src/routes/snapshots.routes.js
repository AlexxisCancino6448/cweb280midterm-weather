// weather fetch and history endpoints; validation ensures query param present where required
const express = require('express');
const { query } = require('express-validator');
const validate = require('../middleware/validate.middleware');
const snapshotsController = require('../controllers/snapshots.controller');

const router = express.Router();

router.get(
  '/',
  [
    query('query').isString().notEmpty().withMessage('query is required'),
    query('units').optional().isIn(['m', 'f', 's']).withMessage('invalid units')
  ],
  validate,
  snapshotsController.fetchCurrentWeather
);

router.get(
  '/history',
  [query('query').optional().isString()],
  validate,
  snapshotsController.listSnapshots
);

router.get('/snapshots', async (req, res) => {
  try {
    const snapshots = await snapshotsController.getSnapshotsForUser?.(req) || await snapshotsController.listSnapshotsHandler?.(req) || [];
    return res.json({ success: true, data: snapshots });
  } catch (err) {
    console.error('Error loading snapshots:', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'Failed to load snapshots' });
  }
});

module.exports = router;
