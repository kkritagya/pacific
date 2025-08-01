const request = require('supertest');
const express = require('express');
const productRoutes = require('../route/productRoutes');
const Product = require('../model/Product');

// Create test app
const app = express();
app.use(express.json());
app.use('/products', productRoutes);

describe('Product Tests', () => {
  describe('GET /products', () => {
    beforeEach(async () => {
      await testUtils.createTestProduct({ name: 'Product 1', category: 'vinyl' });
      await testUtils.createTestProduct({ name: 'Product 2', category: 'merch' });
      await testUtils.createTestProduct({ name: 'Product 3', category: 'vinyl' });
    });

    it('should get all products', async () => {
      const response = await request(app)
        .get('/products')
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(Array.isArray(response.body.products)).toBe(true);
      expect(response.body.products).toHaveLength(3);
    });

    it('should filter products by category', async () => {
      const response = await request(app)
        .get('/products?category=vinyl')
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(response.body.products).toHaveLength(2);
      response.body.products.forEach(product => {
        expect(product.category).toBe('vinyl');
      });
    });

    it('should search products by name', async () => {
      const response = await request(app)
        .get('/products?search=Product 1')
        .expect(200);

      expect(response.body).toHaveProperty('products');
      expect(response.body.products).toHaveLength(1);
      expect(response.body.products[0].name).toBe('Product 1');
    });
  });

  describe('GET /products/:id', () => {
    let product;

    beforeEach(async () => {
      product = await testUtils.createTestProduct();
    });

    it('should get product by id', async () => {
      const response = await request(app)
        .get(`/products/${product.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('product');
      expect(response.body.product.id).toBe(product.id);
      expect(response.body.product.name).toBe(product.name);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/products/99999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Product not found');
    });
  });

  describe('POST /products', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'New Product',
        description: 'New product description',
        price: 39.99,
        category: 'vinyl',
        imageUrl: 'new-product.jpg'
      };

      const response = await request(app)
        .post('/products')
        .send(productData)
        .expect(201);

      expect(response.body).toHaveProperty('product');
      expect(response.body.product.name).toBe(productData.name);
      expect(response.body.product.price).toBe(productData.price);
      expect(response.body.product.category).toBe(productData.category);
    });

    it('should return error for missing required fields', async () => {
      const productData = {
        name: 'New Product'
        // Missing required fields
      };

      const response = await request(app)
        .post('/products')
        .send(productData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return error for invalid price', async () => {
      const productData = {
        name: 'New Product',
        description: 'New product description',
        price: -10, // Invalid negative price
        category: 'vinyl',
        imageUrl: 'new-product.jpg'
      };

      const response = await request(app)
        .post('/products')
        .send(productData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /products/:id', () => {
    let product;

    beforeEach(async () => {
      product = await testUtils.createTestProduct();
    });

    it('should update product successfully', async () => {
      const updateData = {
        name: 'Updated Product',
        price: 49.99
      };

      const response = await request(app)
        .put(`/products/${product.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('product');
      expect(response.body.product.name).toBe(updateData.name);
      expect(response.body.product.price).toBe(updateData.price);
    });

    it('should return 404 for non-existent product', async () => {
      const updateData = {
        name: 'Updated Product'
      };

      const response = await request(app)
        .put('/products/99999')
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Product not found');
    });
  });

  describe('DELETE /products/:id', () => {
    let product;

    beforeEach(async () => {
      product = await testUtils.createTestProduct();
    });

    it('should delete product successfully', async () => {
      const response = await request(app)
        .delete(`/products/${product.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Product deleted successfully');

      // Verify product is deleted
      const getResponse = await request(app)
        .get(`/products/${product.id}`)
        .expect(404);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .delete('/products/99999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Product not found');
    });
  });

  describe('GET /products/categories', () => {
    beforeEach(async () => {
      await testUtils.createTestProduct({ category: 'vinyl' });
      await testUtils.createTestProduct({ category: 'merch' });
      await testUtils.createTestProduct({ category: 'vinyl' });
    });

    it('should get all unique categories', async () => {
      const response = await request(app)
        .get('/products/categories')
        .expect(200);

      expect(response.body).toHaveProperty('categories');
      expect(Array.isArray(response.body.categories)).toBe(true);
      expect(response.body.categories).toContain('vinyl');
      expect(response.body.categories).toContain('merch');
    });
  });
}); 