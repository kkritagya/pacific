const Order = require('../model/Order');
const OrderItem = require('../model/OrderItem');
const Product = require('../model/Product');
const User = require('../model/User');

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id; // Get user ID from authenticated token
    
    // Calculate total
    let total = 0;
    for (let item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product with ID ${item.productId} not found` });
      }
      total += product.price * item.quantity;
    }

    // Generate order number
    const orderNumber = 'ORD-' + Date.now();

    // Create order
    const order = await Order.create({
      userId,
      total,
      shippingAddress,
      paymentMethod,
      orderNumber
    });

    // Create order items
    for (let item of items) {
      const product = await Product.findByPk(item.productId);
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        productName: product.name
      });
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [Product]
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          include: [Product]
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.params.userId },
      include: [
        {
          model: OrderItem,
          include: [Product]
        }
      ]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    await order.update({ status });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    
    // Delete associated order items first
    await OrderItem.destroy({ where: { orderId: req.params.id } });
    
    // Delete the order
    await order.destroy();
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 