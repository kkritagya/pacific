import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: 'admin@pacific.com',
    password: 'admin123'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await adminLogin(formData.email, formData.password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Admin login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-icon">
              <Shield size={48} />
            </div>
            <h1 className="admin-login-title">Admin Access</h1>
            <p className="admin-login-subtitle">Sign in to Pacific Records Admin Panel</p>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={16} />
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter admin email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock size={16} />
                Password
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary admin-login-btn"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Access Admin Panel'}
            </button>
          </form>

          <div className="admin-login-footer">
            <p>
              <Link to="/login" className="auth-link">
                Regular User Login
              </Link>
            </p>
            <div className="demo-credentials">
              <small>Demo Credentials:</small>
              <small>Email: admin@pacific.com</small>
              <small>Password: admin123</small>
            </div>
          </div>
        </div>

        <div className="admin-visual">
          <div className="visual-content">
            <h2>Pacific Records</h2>
            <h3>Admin Dashboard</h3>
            <p>Manage artists, orders, and content with powerful administrative tools.</p>
            <div className="admin-features">
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Analytics & Reports</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🛒</span>
                <span>Order Management</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎵</span>
                <span>Content Control</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;