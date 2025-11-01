// CRUD for saved locations with validation and ownership enforced in services 
const express = require('express');
const { body, param } = require('express-validator');
const validate = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const locationsController = require('../controllers/locations.controller');

const router = express.Router();
router.use(authMiddleware.requireAuth);

router.get('/', locationsController.listSavedLocations);

router.post(
  '/',
  [body('name').isString().notEmpty().withMessage('name required'), body('query').isString().notEmpty().withMessage('query required')],
  validate,
  locationsController.createSavedLocation
);

router.get('/:id', [param('id').isUUID().withMessage('invalid id')], validate, locationsController.getSavedLocation);
router.put('/:id', [param('id').isUUID().withMessage('invalid id')], validate, locationsController.updateSavedLocation);
router.delete('/:id', [param('id').isUUID().withMessage('invalid id')], validate, locationsController.deleteSavedLocation);

module.exports = router;
