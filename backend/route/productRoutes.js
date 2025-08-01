const express = require('express');
const router = express.Router();
const productController = require('../Controller/productController');
const { requireAdmin } = require('../middleware/auth');

// Public routes (anyone can view products)
router.get('/', productController.getProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);

// Admin-only routes (require admin authentication)
router.post('/', requireAdmin, productController.createProduct);
router.put('/:id', requireAdmin, productController.updateProduct);
router.delete('/:id', requireAdmin, productController.deleteProduct);

module.exports = router; 