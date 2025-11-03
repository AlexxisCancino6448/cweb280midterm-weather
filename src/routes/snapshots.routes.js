// weather fetch and history endpoints the validation ensures query param present
const express = require('express');
const { query } = require('express-validator');
const validate = require('../middleware/validate.middleware');
const snapshotsController = require('../controllers/snapshots.controller');

const router = express.Router();

router.get(
  '/',
  [query('query').isString().notEmpty().withMessage('query is required'), query('units').optional().isIn(['c', 'f', 's']).withMessage('invalid units')],
  validate,
  snapshotsController.fetchCurrentWeather
);

router.get('/history', [query('query').optional().isString()], validate, snapshotsController.listSnapshots);

module.exports = router;
