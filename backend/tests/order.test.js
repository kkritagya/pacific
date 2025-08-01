const request = require('supertest');
const express = require('express');
const orderRoutes = require('../route/orderRoutes');
const Order = require('../model/Order');
const OrderItem = require('../model/OrderItem');
const Product = require('../model/Product');
const User = require('../model/User');
const Cart = require('../model/Cart');

// Create test app
const app = express();
app.use(express.json());
app.use('/orders', orderRoutes);

describe('Order Tests', () => {
  let user, product, token;

  beforeEach(async () => {
    user = await testUtils.createTestUser();
    product = await testUtils.createTestProduct();
    token = testUtils.generateToken(user.id);
  });

  describe('POST /orders', () => {
    beforeEach(async () => {
      // Add items to cart
      await Cart.create({
        userId: user.id,
        productId: product.id,
        quantity: 2
      });
    });

    it('should create order from cart items', async () => {
      const orderData = {
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'Test Country'
        }
      };

      const response = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(orderData)
        .expect(201);

      expect(response.body).toHaveProperty('order');
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Order created successfully');
      expect(response.body.order.userId).toBe(user.id);
      expect(response.body.order.status).toBe('pending');
      expect(response.body.order.shippingAddress).toEqual(orderData.shippingAddress);

      // Verify order items were created
      expect(response.body.order.items).toHaveLength(1);
      expect(response.body.order.items[0].productId).toBe(product.id);
      expect(response.body.order.items[0].quantity).toBe(2);
    });

    it('should return error for empty cart', async () => {
      // Clear cart
      await Cart.destroy({ where: { userId: user.id } });

      const orderData = {
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'Test Country'
        }
      };

      const response = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(orderData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Cart is empty');
    });

    it('should return error without shipping address', async () => {
      const response = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /orders', () => {
    let order;

    beforeEach(async () => {
      // Create an order
      order = await Order.create({
        userId: user.id,
        status: 'pending',
        total: 59.98,
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'Test Country'
        }
      });

      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: 2,
        price: 29.99
      });
    });

    it('should get user orders', async () => {
      const response = await request(app)
        .get('/orders')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('orders');
      expect(Array.isArray(response.body.orders)).toBe(true);
      expect(response.body.orders).toHaveLength(1);
      expect(response.body.orders[0].id).toBe(order.id);
      expect(response.body.orders[0].status).toBe('pending');
    });

    it('should return empty array for user with no orders', async () => {
      const newUser = await testUtils.createTestUser({ email: 'new@example.com' });
      const newToken = testUtils.generateToken(newUser.id);

      const response = await request(app)
        .get('/orders')
        .set('Authorization', `Bearer ${newToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('orders');
      expect(response.body.orders).toHaveLength(0);
    });

    it('should return error without authentication', async () => {
      const response = await request(app)
        .get('/orders')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /orders/:id', () => {
    let order;

    beforeEach(async () => {
      order = await Order.create({
        userId: user.id,
        status: 'pending',
        total: 59.98,
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'Test Country'
        }
      });

      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: 2,
        price: 29.99
      });
    });

    it('should get order by id', async () => {
      const response = await request(app)
        .get(`/orders/${order.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('order');
      expect(response.body.order.id).toBe(order.id);
      expect(response.body.order.userId).toBe(user.id);
      expect(response.body.order.items).toHaveLength(1);
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .get('/orders/99999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Order not found');
    });

    it('should return 403 for order belonging to different user', async () => {
      const otherUser = await testUtils.createTestUser({ email: 'other@example.com' });
      const otherOrder = await Order.create({
        userId: otherUser.id,
        status: 'pending',
        total: 29.99,
        shippingAddress: {
          street: '456 Other St',
          city: 'Other City',
          state: 'Other State',
          zipCode: '54321',
          country: 'Other Country'
        }
      });

      const response = await request(app)
        .get(`/orders/${otherOrder.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Access denied');
    });
  });

  describe('PUT /orders/:id/status', () => {
    let order;

    beforeEach(async () => {
      order = await Order.create({
        userId: user.id,
        status: 'pending',
        total: 59.98,
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'Test Country'
        }
      });
    });

    it('should update order status', async () => {
      const updateData = {
        status: 'shipped'
      };

      const response = await request(app)
        .put(`/orders/${order.id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('order');
      expect(response.body.order.status).toBe('shipped');
    });

    it('should return error for invalid status', async () => {
      const updateData = {
        status: 'invalid-status'
      };

      const response = await request(app)
        .put(`/orders/${order.id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent order', async () => {
      const updateData = {
        status: 'shipped'
      };

      const response = await request(app)
        .put('/orders/99999/status')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Order not found');
    });
  });

  describe('DELETE /orders/:id', () => {
    let order;

    beforeEach(async () => {
      order = await Order.create({
        userId: user.id,
        status: 'pending',
        total: 59.98,
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          country: 'Test Country'
        }
      });
    });

    it('should cancel pending order', async () => {
      const response = await request(app)
        .delete(`/orders/${order.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Order cancelled successfully');

      // Verify order status was updated
      const updatedOrder = await Order.findByPk(order.id);
      expect(updatedOrder.status).toBe('cancelled');
    });

    it('should return error for non-cancellable order', async () => {
      // Update order to shipped status
      await order.update({ status: 'shipped' });

      const response = await request(app)
        .delete(`/orders/${order.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Order cannot be cancelled');
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .delete('/orders/99999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Order not found');
    });
  });
}); 