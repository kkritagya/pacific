require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./Database');
const User = require('./model/User');
const Product = require('./model/Product');
const Order = require('./model/Order');
const OrderItem = require('./model/OrderItem');
const Artist = require('./model/Artist');
const Cart = require('./model/Cart');
const { requireAdmin } = require('./middleware/auth');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Test endpoint to check User table schema
app.get('/test-schema', async (req, res) => {
  try {
    const sequelize = require('./Database');
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'Users' 
      ORDER BY ordinal_position;
    `);
    res.json({ 
      message: 'User table schema:',
      columns: results 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test endpoint to check user admin status
app.get('/test-user/:id', async (req, res) => {
  try {
    const User = require('./model/User');
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User routes
const userRoutes = require('./route/userRoutes');
app.use('/users', userRoutes);

// Cart routes
const cartRoutes = require('./route/cartRoutes');
app.use('/cart', cartRoutes);

// Admin routes
const adminRoutes = require('./route/adminRoutes');
app.use('/admin', adminRoutes);
console.log('Admin routes registered at /admin');

// Auth routes
const authRoutes = require('./route/authRoutes');
app.use('/auth', authRoutes);

// Product routes
const productRoutes = require('./route/productRoutes');
app.use('/products', productRoutes);

// Order routes
const orderRoutes = require('./route/orderRoutes');
app.use('/orders', orderRoutes);
console.log('Order routes registered at /orders');

// Artist routes (protect admin routes)
const artistRoutes = require('./route/artistRoutes');
app.use('/artists', artistRoutes);

// Set up model relationships
Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

OrderItem.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(OrderItem, { foreignKey: 'productId' });

// Cart relationships
Cart.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Cart, { foreignKey: 'userId' });

Cart.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Cart, { foreignKey: 'productId' });

const PORT = process.env.PORT || 5000;

// Connect to database and sync models
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    return sequelize.sync(); // Normal sync
  })
  .then(() => {
    console.log('All models were synchronized successfully.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }); 