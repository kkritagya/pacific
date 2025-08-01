require('dotenv').config();

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';

// Import database connection
const sequelize = require('../Database');

// Global test setup
beforeAll(async () => {
  // Connect to test database
  await sequelize.authenticate();
  console.log('Test database connected');
});

// Global test teardown
afterAll(async () => {
  // Close database connection
  await sequelize.close();
  console.log('Test database connection closed');
});

// Clean up database between tests
beforeEach(async () => {
  // Sync database and clear all tables
  await sequelize.sync({ force: true });
});

// Global test utilities
global.testUtils = {
  // Helper to create a test user
  createTestUser: async (userData = {}) => {
    const User = require('../model/User');
    const defaultUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      isAdmin: false,
      ...userData
    };
    return await User.create(defaultUser);
  },

  // Helper to create a test product
  createTestProduct: async (productData = {}) => {
    const Product = require('../model/Product');
    const defaultProduct = {
      name: 'Test Product',
      description: 'Test description',
      price: 29.99,
      category: 'vinyl',
      imageUrl: 'test-image.jpg',
      ...productData
    };
    return await Product.create(defaultProduct);
  },

  // Helper to create a test artist
  createTestArtist: async (artistData = {}) => {
    const Artist = require('../model/Artist');
    const defaultArtist = {
      name: 'Test Artist',
      bio: 'Test bio',
      imageUrl: 'test-artist.jpg',
      ...artistData
    };
    return await Artist.create(defaultArtist);
  },

  // Helper to generate JWT token
  generateToken: (userId) => {
    const jwt = require('jsonwebtoken');
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
  }
}; 