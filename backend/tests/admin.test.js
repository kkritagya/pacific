const request = require('supertest');
const express = require('express');
const adminRoutes = require('../route/adminRoutes');
const User = require('../model/User');
const Product = require('../model/Product');
const Order = require('../model/Order');

// Create test app
const app = express();
app.use(express.json());
app.use('/admin', adminRoutes);

describe('Admin Tests', () => {
  let adminUser, regularUser, adminToken, userToken;

  beforeEach(async () => {
    adminUser = await testUtils.createTestUser({
      email: 'admin@example.com',
      isAdmin: true
    });
    regularUser = await testUtils.createTestUser({
      email: 'user@example.com',
      isAdmin: false
    });
    adminToken = testUtils.generateToken(adminUser.id);
    userToken = testUtils.generateToken(regularUser.id);
  });

  describe('POST /admin/login', () => {
    it('should login admin with valid credentials', async () => {
      const loginData = {
        email: 'admin@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/admin/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.isAdmin).toBe(true);
    });

    it('should return error for non-admin user', async () => {
      const loginData = {
        email: 'user@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/admin/login')
        .send(loginData)
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Access denied. Admin only.');
    });

    it('should return error for invalid credentials', async () => {
      const loginData = {
        email: 'admin@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/admin/login')
        .send(loginData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /admin/users', () => {
    beforeEach(async () => {
      await testUtils.createTestUser({ email: 'user1@example.com' });
      await testUtils.createTestUser({ email: 'user2@example.com' });
    });

    it('should get all users for admin', async () => {
      const response = await request(app)
        .get('/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.users.length).toBeGreaterThanOrEqual(3); // admin + regular + 2 test users
    });

    it('should return error for non-admin user', async () => {
      const response = await request(app)
        .get('/admin/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Access denied. Admin only.');
    });

    it('should return error without authentication', async () => {
      const response = await request(app)
        .get('/admin/users')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /admin/users/:id', () => {
    it('should get user by id for admin', async () => {
      const response = await request(app)
        .get(`/admin/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.id).toBe(regularUser.id);
      expect(response.body.user.email).toBe(regularUser.email);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/admin/users/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('PUT /admin/users/:id', () => {
    it('should update user for admin', async () => {
      const updateData = {
        name: 'Updated Name',
        isAdmin: true
      };

      const response = await request(app)
        .put(`/admin/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.name).toBe(updateData.name);
      expect(response.body.user.isAdmin).toBe(updateData.isAdmin);
    });

    it('should return 404 for non-existent user', async () => {
      const updateData = {
        name: 'Updated Name'
      };

      const response = await request(app)
        .put('/admin/users/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('DELETE /admin/users/:id', () => {
    it('should delete user for admin', async () => {
      const response = await request(app)
        .delete(`/admin/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('User deleted successfully');

      // Verify user is deleted
      const getResponse = await request(app)
        .get(`/admin/users/${regularUser.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .delete('/admin/users/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('GET /admin/orders', () => {
    let order;

    beforeEach(async () => {
      order = await Order.create({
        userId: regularUser.id,
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

    it('should get all orders for admin', async () => {
      const response = await request(app)
        .get('/admin/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('orders');
      expect(Array.isArray(response.body.orders)).toBe(true);
      expect(response.body.orders).toHaveLength(1);
      expect(response.body.orders[0].id).toBe(order.id);
    });

    it('should filter orders by status', async () => {
      const response = await request(app)
        .get('/admin/orders?status=pending')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('orders');
      expect(response.body.orders).toHaveLength(1);
      response.body.orders.forEach(order => {
        expect(order.status).toBe('pending');
      });
    });
  });

  describe('GET /admin/orders/:id', () => {
    let order;

    beforeEach(async () => {
      order = await Order.create({
        userId: regularUser.id,
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

    it('should get order by id for admin', async () => {
      const response = await request(app)
        .get(`/admin/orders/${order.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('order');
      expect(response.body.order.id).toBe(order.id);
      expect(response.body.order.userId).toBe(regularUser.id);
    });

    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .get('/admin/orders/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Order not found');
    });
  });

  describe('PUT /admin/orders/:id/status', () => {
    let order;

    beforeEach(async () => {
      order = await Order.create({
        userId: regularUser.id,
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

    it('should update order status for admin', async () => {
      const updateData = {
        status: 'shipped'
      };

      const response = await request(app)
        .put(`/admin/orders/${order.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('order');
      expect(response.body.order.status).toBe('shipped');
    });

    it('should return 404 for non-existent order', async () => {
      const updateData = {
        status: 'shipped'
      };

      const response = await request(app)
        .put('/admin/orders/99999/status')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Order not found');
    });
  });

  describe('GET /admin/dashboard', () => {
    beforeEach(async () => {
      // Create some test data
      await testUtils.createTestUser({ email: 'user1@example.com' });
      await testUtils.createTestUser({ email: 'user2@example.com' });
      
      await Order.create({
        userId: regularUser.id,
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

      await testUtils.createTestProduct({ name: 'Product 1' });
      await testUtils.createTestProduct({ name: 'Product 2' });
    });

    it('should get dashboard stats for admin', async () => {
      const response = await request(app)
        .get('/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('stats');
      expect(response.body.stats).toHaveProperty('totalUsers');
      expect(response.body.stats).toHaveProperty('totalOrders');
      expect(response.body.stats).toHaveProperty('totalProducts');
      expect(response.body.stats).toHaveProperty('totalRevenue');
    });
  });
}); 