import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getCartCount 
  } = useCart();
  const { token } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    try {
      setCheckoutLoading(true);
      
      const response = await fetch('http://localhost:5000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.productId || item.Product?.id,
            quantity: item.quantity,
            price: item.price
          })),
          total: getCartTotal(),
          shippingAddress: 'Default Address', // You can add a form for this later
          paymentMethod: 'Credit Card' // You can add a form for this later
        }),
      });

      if (response.ok) {
        const orderData = await response.json();
        alert(`Order created successfully! Order ID: ${orderData.id}`);
        clearCart();
      } else {
        const errorData = await response.json();
        alert(`Checkout failed: ${errorData.error}`);
      }
    } catch (error) {
      alert('Network error during checkout. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <ShoppingBag size={64} />
            <h2>Your cart is empty</h2>
            <p>Add some items to get started</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1 className="page-title">
            <ShoppingBag className="title-icon" />
            Shopping Cart
          </h1>
          <p className="cart-count">{getCartCount()} items</p>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.productImage || item.Product?.image} alt={item.productName || item.Product?.name} />
                </div>
                
                <div className="item-details">
                  <h3 className="item-name">{item.productName || item.Product?.name}</h3>
                  <p className="item-price">${item.price}</p>
                </div>
                
                <div className="item-quantity">
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="item-total">
                  <span className="total-amount">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                
                <div className="item-actions">
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="summary-header">
              <h3>Order Summary</h3>
            </div>
            
            <div className="summary-items">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
            
            <div className="summary-actions">
              <button 
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || checkoutLoading}
              >
                <CreditCard size={20} />
                {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              
              <button 
                className="clear-cart-btn"
                onClick={clearCart}
                disabled={cartItems.length === 0}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;