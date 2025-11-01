// auth endpoints with express-validator validations 
const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate.middleware');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post(
  '/register',
  [
    body('username').isLength({ min: 3 }).trim().withMessage('username must be at least 3 characters'),
    body('email').isEmail().normalizeEmail().withMessage('valid email required'),
    body('password').isLength({ min: 8 }).withMessage('password must be at least 8 characters')
  ],
  validate,
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('valid email required'),
    body('password').exists().withMessage('password is required')
  ],
  validate,
  authController.login
);

module.exports = router;
