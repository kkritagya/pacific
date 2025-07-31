import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navigation.css';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { getCartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const userNavItems = [
    { path: '/', label: 'Home' },
    { path: '/artists', label: 'Artists' },
    { path: '/merch', label: 'Merch' },
    { path: '/vinyl', label: 'Vinyl' },
    { path: '/tours', label: 'Tours' },
    { path: '/presave', label: 'Presave' }
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/orders', label: 'Orders' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to={isAdmin ? '/admin/dashboard' : '/'} className="nav-logo">
          <span className="logo-text">PACIFIC</span>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'nav-menu-open' : ''}`}>
          {isAdmin ? (
            adminNavItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'nav-link-active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))
          ) : (
            userNavItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'nav-link-active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))
          )}
        </div>

        <div className="nav-actions">
          {!isAdmin && user && (
            <Link to="/cart" className="nav-cart">
              <ShoppingCart size={20} />
              {getCartCount() > 0 && (
                <span className="cart-badge">{getCartCount()}</span>
              )}
            </Link>
          )}

          {user || isAdmin ? (
            <div className="nav-user">
              <Link to={isAdmin ? '/admin/dashboard' : '/profile'} className="nav-profile">
                <User size={20} />
              </Link>
              <button onClick={handleLogout} className="nav-logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}

          <button 
            className="nav-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;