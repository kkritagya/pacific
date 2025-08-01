const request = require('supertest');
const express = require('express');
const authRoutes = require('../route/authRoutes');
const productRoutes = require('../route/productRoutes');
const cartRoutes = require('../route/cartRoutes');
const orderRoutes = require('../route/orderRoutes');
const User = require('../model/User');
const Product = require('../model/Product');
const Cart = require('../model/Cart');
const Order = require('../model/Order');

// Create test app with all routes
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

describe('Integration Tests', () => {
  describe('Complete User Journey', () => {
    let userToken, product;

    beforeEach(async () => {
      product = await testUtils.createTestProduct({
        name: 'Test Vinyl',
        price: 29.99,
        category: 'vinyl'
      });
    });

    it('should complete full user journey: register -> login -> add to cart -> checkout', async () => {
      // 1. Register new user
      const registerData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      const registerResponse = await request(app)
        .post('/auth/register')
        .send(registerData)
        .expect(201);

      expect(registerResponse.body).toHaveProperty('user');
      expect(registerResponse.body).toHaveProperty('token');
      userToken = registerResponse.body.token;

      // 2. Login user
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      };

      const loginResponse = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(loginResponse.body).toHaveProperty('user');
      expect(loginResponse.body).toHaveProperty('token');

      // 3. Browse products
      const productsResponse = await request(app)
        .get('/products')
        .expect(200);

      expect(productsResponse.body).toHaveProperty('products');
      expect(productsResponse.body.products.length).toBeGreaterThan(0);

      // 4. Get specific product
      const productResponse = await request(app)
        .get(`/products/${product.id}`)
        .expect(200);

      expect(productResponse.body).toHaveProperty('product');
      expect(productResponse.body.product.id).toBe(product.id);

      // 5. Add item to cart
      const cartData = {
        productId: product.id,
        quantity: 2
      };

      const addToCartResponse = await request(app)
        .post('/cart/add')
        .set('Authorization', `Bearer ${userToken}`)
        .send(cartData)
        .expect(201);

      expect(addToCartResponse.body).toHaveProperty('message');
      expect(addToCartResponse.body.message).toBe('Item added to cart');

      // 6. View cart
      const cartResponse = await request(app)
        .get('/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(cartResponse.body).toHaveProperty('cart');
      expect(cartResponse.body.cart).toHaveLength(1);
      expect(cartResponse.body.cart[0].productId).toBe(product.id);
      expect(cartResponse.body.cart[0].quantity).toBe(2);

      // 7. Create order
      const orderData = {
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      };

      const orderResponse = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(201);

      expect(orderResponse.body).toHaveProperty('order');
      expect(orderResponse.body).toHaveProperty('message');
      expect(orderResponse.body.message).toBe('Order created successfully');
      expect(orderResponse.body.order.status).toBe('pending');
      expect(orderResponse.body.order.items).toHaveLength(1);

      // 8. Verify cart is cleared after order
      const cartAfterOrderResponse = await request(app)
        .get('/cart')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(cartAfterOrderResponse.body.cart).toHaveLength(0);

      // 9. View order history
      const ordersResponse = await request(app)
        .get('/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(ordersResponse.body).toHaveProperty('orders');
      expect(ordersResponse.body.orders).toHaveLength(1);
      expect(ordersResponse.body.orders[0].id).toBe(orderResponse.body.order.id);

      // 10. View specific order
      const specificOrderResponse = await request(app)
        .get(`/orders/${orderResponse.body.order.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(specificOrderResponse.body).toHaveProperty('order');
      expect(specificOrderResponse.body.order.id).toBe(orderResponse.body.order.id);
    });

    it('should handle multiple products in cart and order', async () => {
      // Create additional product
      const product2 = await testUtils.createTestProduct({
        name: 'Test Merch',
        price: 19.99,
        category: 'merch'
      });

      // Register and login user
      const user = await testUtils.createTestUser();
      const token = testUtils.generateToken(user.id);

      // Add multiple items to cart
      await request(app)
        .post('/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product.id, quantity: 1 })
        .expect(201);

      await request(app)
        .post('/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product2.id, quantity: 3 })
        .expect(201);

      // Verify cart has both items
      const cartResponse = await request(app)
        .get('/cart')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(cartResponse.body.cart).toHaveLength(2);

      // Create order
      const orderData = {
        shippingAddress: {
          street: '456 Oak St',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        }
      };

      const orderResponse = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(orderData)
        .expect(201);

      expect(orderResponse.body.order.items).toHaveLength(2);
      expect(orderResponse.body.order.total).toBe(29.99 + (19.99 * 3));
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle invalid product in cart', async () => {
      const user = await testUtils.createTestUser();
      const token = testUtils.generateToken(user.id);

      const response = await request(app)
        .post('/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: 99999, quantity: 1 })
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Product not found');
    });

    it('should handle empty cart checkout', async () => {
      const user = await testUtils.createTestUser();
      const token = testUtils.generateToken(user.id);

      const response = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          shippingAddress: {
            street: '123 Test St',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345',
            country: 'Test Country'
          }
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Cart is empty');
    });

    it('should handle unauthorized access to protected routes', async () => {
      const response = await request(app)
        .get('/cart')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle invalid token', async () => {
      const response = await request(app)
        .get('/cart')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Data Consistency', () => {
    it('should maintain data consistency across operations', async () => {
      const user = await testUtils.createTestUser();
      const product = await testUtils.createTestProduct();
      const token = testUtils.generateToken(user.id);

      // Add to cart
      await request(app)
        .post('/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: product.id, quantity: 2 })
        .expect(201);

      // Verify cart
      const cartResponse = await request(app)
        .get('/cart')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(cartResponse.body.cart[0].quantity).toBe(2);

      // Update cart quantity
      await request(app)
        .put(`/cart/${product.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantity: 5 })
        .expect(200);

      // Verify updated cart
      const updatedCartResponse = await request(app)
        .get('/cart')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(updatedCartResponse.body.cart[0].quantity).toBe(5);

      // Create order
      const orderResponse = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          shippingAddress: {
            street: '123 Test St',
            city: 'Test City',
            state: 'Test State',
            zipCode: '12345',
            country: 'Test Country'
          }
        })
        .expect(201);

      // Verify order has correct quantity
      expect(orderResponse.body.order.items[0].quantity).toBe(5);

      // Verify cart is empty
      const finalCartResponse = await request(app)
        .get('/cart')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(finalCartResponse.body.cart).toHaveLength(0);
    });
  });
}); 