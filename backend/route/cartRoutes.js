const express = require('express');
const router = express.Router();
const cartController = require('../Controller/cartController');
const { authenticateToken } = require('../middleware/auth');

// All cart routes require authentication
router.use(authenticateToken);

// Get user's cart
router.get('/', cartController.getCart);

// Get cart count (for navigation)
router.get('/count', cartController.getCartCount);

// Add item to cart
router.post('/add', cartController.addToCart);

// Update cart item quantity
router.put('/item/:id', cartController.updateCartItem);

// Remove item from cart
router.delete('/item/:id', cartController.removeFromCart);

// Clear entire cart
router.delete('/clear', cartController.clearCart);

module.exports = router; 