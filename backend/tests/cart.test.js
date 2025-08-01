const request = require('supertest');
const express = require('express');
const cartRoutes = require('../route/cartRoutes');
const Cart = require('../model/Cart');
const Product = require('../model/Product');
const User = require('../model/User');

// Create test app
const app = express();
app.use(express.json());
app.use('/cart', cartRoutes);

describe('Cart Tests', () => {
  let user, product, token;

  beforeEach(async () => {
    user = await testUtils.createTestUser();
    product = await testUtils.createTestProduct();
    token = testUtils.generateToken(user.id);
  });

  describe('GET /cart', () => {
    beforeEach(async () => {
      // Add items to cart
      await Cart.create({
        userId: user.id,
        productId: product.id,
        quantity: 2
      });
    });

    it('should get user cart items', async () => {
      const response = await request(app)
        .get('/cart')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('cart');
      expect(Array.isArray(response.body.cart)).toBe(true);
      expect(response.body.cart).toHaveLength(1);
      expect(response.body.cart[0].productId).toBe(product.id);
      expect(response.body.cart[0].quantity).toBe(2);
    });

    it('should return empty cart for new user', async () => {
      const newUser = await testUtils.createTestUser({ email: 'new@example.com' });
      const newToken = testUtils.generateToken(newUser.id);

      const response = await request(app)
        .get('/cart')
        .set('Authorization', `Bearer ${newToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('cart');
      expect(response.body.cart).toHaveLength(0);
    });

    it('should return error without authentication', async () => {
      const response = await request(app)
        .get('/cart')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /cart/add', () => {
    it('should add item to cart successfully', async () => {
      const cartData = {
        productId: product.id,
        quantity: 3
      };

      const response = await request(app)
        .post('/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send(cartData)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Item added to cart');

      // Verify item was added
      const cartResponse = await request(app)
        .get('/cart')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(cartResponse.body.cart).toHaveLength(1);
      expect(cartResponse.body.cart[0].quantity).toBe(3);
    });

    it('should update quantity if item already exists in cart', async () => {
      // Add item first time
      await request(app)
        .post('/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product.id, quantity: 2 });

      // Add same item again
      const response = await request(app)
        .post('/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product.id, quantity: 3 })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Cart updated');

      // Verify quantity was updated
      const cartResponse = await request(app)
        .get('/cart')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(cartResponse.body.cart[0].quantity).toBe(5);
    });

    it('should return error for non-existent product', async () => {
      const cartData = {
        productId: 99999,
        quantity: 1
      };

      const response = await request(app)
        .post('/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send(cartData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Product not found');
    });

    it('should return error for invalid quantity', async () => {
      const cartData = {
        productId: product.id,
        quantity: 0
      };

      const response = await request(app)
        .post('/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send(cartData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /cart/:productId', () => {
    beforeEach(async () => {
      await Cart.create({
        userId: user.id,
        productId: product.id,
        quantity: 2
      });
    });

    it('should update cart item quantity', async () => {
      const updateData = {
        quantity: 5
      };

      const response = await request(app)
        .put(`/cart/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Cart updated');

      // Verify quantity was updated
      const cartResponse = await request(app)
        .get('/cart')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(cartResponse.body.cart[0].quantity).toBe(5);
    });

    it('should return error for non-existent cart item', async () => {
      const otherProduct = await testUtils.createTestProduct({ name: 'Other Product' });
      const updateData = {
        quantity: 5
      };

      const response = await request(app)
        .put(`/cart/${otherProduct.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Item not found in cart');
    });

    it('should return error for invalid quantity', async () => {
      const updateData = {
        quantity: -1
      };

      const response = await request(app)
        .put(`/cart/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /cart/:productId', () => {
    beforeEach(async () => {
      await Cart.create({
        userId: user.id,
        productId: product.id,
        quantity: 2
      });
    });

    it('should remove item from cart', async () => {
      const response = await request(app)
        .delete(`/cart/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Item removed from cart');

      // Verify item was removed
      const cartResponse = await request(app)
        .get('/cart')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(cartResponse.body.cart).toHaveLength(0);
    });

    it('should return error for non-existent cart item', async () => {
      const otherProduct = await testUtils.createTestProduct({ name: 'Other Product' });

      const response = await request(app)
        .delete(`/cart/${otherProduct.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Item not found in cart');
    });
  });

  describe('DELETE /cart', () => {
    beforeEach(async () => {
      const product2 = await testUtils.createTestProduct({ name: 'Product 2' });
      await Cart.create({
        userId: user.id,
        productId: product.id,
        quantity: 2
      });
      await Cart.create({
        userId: user.id,
        productId: product2.id,
        quantity: 1
      });
    });

    it('should clear entire cart', async () => {
      const response = await request(app)
        .delete('/cart')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Cart cleared');

      // Verify cart is empty
      const cartResponse = await request(app)
        .get('/cart')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(cartResponse.body.cart).toHaveLength(0);
    });
  });
}); 