const express = require('express');
const router = express.Router();
const orderController = require('../Controller/orderController');
const { requireAdmin, authenticateToken } = require('../middleware/auth');

// Public routes (users can view their own orders)
router.get('/user/:userId', authenticateToken, orderController.getOrdersByUser);

// Admin-only routes (require admin authentication)
router.get('/', requireAdmin, orderController.getOrders);
router.get('/:id', requireAdmin, orderController.getOrderById);
router.put('/:id/status', requireAdmin, orderController.updateOrderStatus);

// Public route for creating orders (users can place orders)
router.post('/', authenticateToken, orderController.createOrder);

module.exports = router; 