const express = require('express');
const router = express.Router();
const adminController = require('../Controller/adminController');
const { requireAdmin } = require('../middleware/auth');

// All admin routes require admin authentication
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboardStats);

// Orders management
router.get('/orders', adminController.getAdminOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);
router.delete('/orders/:id', adminController.deleteOrder);
console.log('DELETE /admin/orders/:id route registered');

// User management
router.get('/users', adminController.getAdminUsers);
router.put('/users/:id/toggle-admin', adminController.toggleUserAdmin);

module.exports = router; 