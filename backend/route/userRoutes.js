const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const { requireAdmin, authenticateToken } = require('../middleware/auth');

// Admin-only routes (require admin authentication)
router.get('/', requireAdmin, userController.getUsers);
router.get('/:id', requireAdmin, userController.getUserById);
router.put('/:id', requireAdmin, userController.updateUser);
router.delete('/:id', requireAdmin, userController.deleteUser);

// Public route for creating users (registration)
router.post('/', userController.createUser);

module.exports = router; 