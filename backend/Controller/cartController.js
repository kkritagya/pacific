const Cart = require('../model/Cart');
const Product = require('../model/Product');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price', 'image', 'stock']
        }
      ]
    });

    // Calculate total
    const total = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    res.json({
      items: cartItems,
      total: total,
      itemCount: cartItems.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if product is already in cart
    const existingCartItem = await Cart.findOne({
      where: { userId, productId }
    });

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity;
      await existingCartItem.update({ quantity: newQuantity });
      
      res.json({
        message: 'Cart item updated',
        item: existingCartItem
      });
    } else {
      // Add new item to cart
      const cartItem = await Cart.create({
        userId,
        productId,
        quantity,
        price: product.price,
        productName: product.name,
        productImage: product.image
      });

      res.status(201).json({
        message: 'Item added to cart',
        item: cartItem
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than 0' });
    }

    const cartItem = await Cart.findOne({
      where: { id, userId }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await cartItem.update({ quantity });

    res.json({
      message: 'Cart item updated',
      item: cartItem
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const cartItem = await Cart.findOne({
      where: { id, userId }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await cartItem.destroy();

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.destroy({
      where: { userId }
    });

    res.json({ message: 'Cart cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get cart count (for navigation)
exports.getCartCount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const count = await Cart.sum('quantity', {
      where: { userId }
    });

    res.json({ count: count || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 