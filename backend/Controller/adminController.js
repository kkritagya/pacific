const { Op } = require('sequelize');
const sequelize = require('../Database');
const User = require('../model/User');
const Order = require('../model/Order');
const Product = require('../model/Product');
const Artist = require('../model/Artist');
const OrderItem = require('../model/OrderItem');

// Get admin dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total revenue
    const totalRevenue = await Order.sum('total', {
      where: {
        status: {
          [Op.notIn]: ['cancelled']
        }
      }
    });

    // Get total orders
    const totalOrders = await Order.count();

    // Get total users
    const totalUsers = await User.count();

    // Get total products
    const totalProducts = await Product.count();

    // Get recent orders (last 5)
    const recentOrders = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ['name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    // Get orders by status
    const ordersByStatus = await Order.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // Get top selling products (simplified for now)
    const topProducts = await Product.findAll({
      attributes: [
        'id',
        'name',
        'price'
      ],
      limit: 5
    });

    res.json({
      stats: {
        totalRevenue: totalRevenue || 0,
        totalOrders,
        totalUsers,
        totalProducts
      },
      recentOrders,
      ordersByStatus,
      topProducts
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get admin orders with advanced filtering
exports.getAdminOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      search,
      startDate,
      endDate 
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Filter by status
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    // Filter by date range
    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { orderNumber: { [Op.iLike]: `%${search}%` } },
        { '$User.name$': { [Op.iLike]: `%${search}%` } },
        { '$User.email$': { [Op.iLike]: `%${search}%` } }
      ];
    }

    const orders = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: OrderItem,
          include: [Product]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      orders: orders.rows,
      total: orders.count,
      totalPages: Math.ceil(orders.count / limit),
      currentPage: parseInt(page)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await order.update({ status });

    res.json({ 
      message: 'Order status updated successfully',
      order 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete order (admin only) - only for completed orders
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Only allow deletion of completed orders
    if (order.status !== 'completed') {
      return res.status(400).json({ error: 'Only completed orders can be deleted' });
    }

    // Delete associated order items first
    await OrderItem.destroy({ where: { orderId: id } });
    
    // Delete the order
    await order.destroy();

    res.json({ 
      message: 'Order deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get admin users with filtering
exports.getAdminUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search,
      isAdmin 
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Filter by admin status
    if (isAdmin !== undefined) {
      whereClause.isAdmin = isAdmin === 'true';
    }

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const users = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      users: users.rows,
      total: users.count,
      totalPages: Math.ceil(users.count / limit),
      currentPage: parseInt(page)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle user admin status
exports.toggleUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({ isAdmin: !user.isAdmin });

    res.json({ 
      message: 'User admin status updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 