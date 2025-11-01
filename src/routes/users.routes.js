// protected user profile endpoints and the routes are enforced by auth middleware
const express = require('express');
const usersController = require('../controllers/users.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware.requireAuth);

router.get('/me', usersController.getProfile);
router.put('/me', usersController.updateProfile);
router.delete('/me', usersController.deleteAccount);

module.exports = router;
