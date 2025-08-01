import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Music,
  DollarSign,
  Calendar,
  Activity,
  Eye,
  Plus,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user, isAdmin } = useAuth();
  const navigate = useNavigate();



  const API_BASE_URL = 'http://localhost:5000';

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setError('No authentication token');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          const errorData = await response.json();
          setError(`Failed to fetch dashboard data: ${errorData.error || response.statusText}`);
        }
      } catch (err) {
        setError(`Network error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Use real data from backend or fallback to mock data
  const stats = dashboardData ? [
    {
      title: 'Total Revenue',
      value: `$${(() => {
        const revenue = parseFloat(dashboardData.stats.totalRevenue);
        return isNaN(revenue) ? '0.00' : revenue.toFixed(2);
      })()}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'success'
    },
    {
      title: 'Total Orders',
      value: dashboardData.stats.totalOrders.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'primary'
    },
    {
      title: 'Total Users',
      value: dashboardData.stats.totalUsers.toString(),
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'secondary'
    },
    {
      title: 'Total Products',
      value: dashboardData.stats.totalProducts.toString(),
      change: '+5.7%',
      trend: 'up',
      icon: Music,
      color: 'accent'
    }
  ] : [
    {
      title: 'Total Revenue',
      value: '$0',
      change: '+0%',
      trend: 'up',
      icon: DollarSign,
      color: 'success'
    },
    {
      title: 'Total Orders',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'primary'
    },
    {
      title: 'Total Users',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: Users,
      color: 'secondary'
    },
    {
      title: 'Total Products',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: Music,
      color: 'accent'
    }
  ];

  const recentOrders = dashboardData?.recentOrders || [];

  const topProducts = dashboardData?.topProducts || [
    {
      name: 'No products yet',
      artist: 'N/A',
      sold: 0,
      revenue: '$0'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'processing': return 'primary';
      case 'shipped': return 'secondary';
      case 'cancelled': return 'error';
      default: return 'neutral';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'pending': return '⏳';
      case 'processing': return '🔄';
      case 'shipped': return '🚚';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  // Navigation functions
  const handleViewOrders = () => {
    navigate('/admin/orders');
  };

  const handleManageUsers = () => {
    navigate('/admin/users');
  };

  const handleManageArtists = () => {
    navigate('/admin/artists');
  };

  const handleViewAllOrders = () => {
    navigate('/admin/orders');
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <div className="loading-state">
            <h2>Loading dashboard data...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <div className="error-state">
            <h2>Error: {error}</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">Admin Dashboard</h1>
            <p className="dashboard-subtitle">
              Welcome back! Here's what's happening at Pacific Records.
            </p>
          </div>
          <div className="header-actions">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="date-range-select"
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
            </select>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card stat-${stat.color}`}>
              <div className="stat-header">
                <div className="stat-icon">
                  <stat.icon size={24} />
                </div>
                <div className={`stat-change ${stat.trend}`}>
                  <TrendingUp size={16} />
                  {stat.change}
                </div>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-title">{stat.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-content">
          <div className="dashboard-main">
            <section className="dashboard-section">
              <div className="section-header">
                <h2>Recent Orders</h2>
                <button className="btn btn-outline" onClick={handleViewAllOrders}>
                  <Eye size={16} />
                  View All
                </button>
              </div>
              <div className="orders-table">
                <div className="table-header">
                  <div className="table-cell">Order ID</div>
                  <div className="table-cell">Customer</div>
                  <div className="table-cell">Items</div>
                  <div className="table-cell">Total</div>
                  <div className="table-cell">Status</div>
                  <div className="table-cell">Date</div>
                </div>
                {recentOrders.length > 0 ? (
                  recentOrders.map(order => (
                    <div key={order.id} className="table-row">
                      <div className="table-cell order-id">#{order.id}</div>
                      <div className="table-cell customer-name">{order.User?.name || 'Unknown'}</div>
                      <div className="table-cell order-items">
                        {order.OrderItems?.length || 0} items
                      </div>
                      <div className="table-cell order-total">
                        ${(() => {
                          const total = parseFloat(order.total);
                          return isNaN(total) ? '0.00' : total.toFixed(2);
                        })()}
                      </div>
                      <div className="table-cell">
                        <span className={`status-badge status-${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)} {order.status || 'pending'}
                        </span>
                      </div>
                      <div className="table-cell order-date">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-orders">
                    <h3>No orders yet</h3>
                    <p>Orders will appear here once customers start shopping</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="dashboard-sidebar">
            <section className="dashboard-section">
              <div className="section-header">
                <h3>Top Products</h3>
              </div>
              <div className="top-products">
                {topProducts.map((product, index) => (
                  <div key={index} className="product-item">
                    <div className="product-rank">#{index + 1}</div>
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-artist">{product.artist}</div>
                      <div className="product-stats">
                        {product.sold} sold • {product.revenue}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboard-section">
              <div className="section-header">
                <h3>Quick Actions</h3>
              </div>
              <div className="quick-actions">
                <button className="action-btn" onClick={handleViewOrders}>
                  <ShoppingBag size={20} />
                  <span>View Orders</span>
                </button>
                <button className="action-btn" onClick={handleManageUsers}>
                  <Users size={20} />
                  <span>Manage Users</span>
                </button>
                <button className="action-btn" onClick={handleManageArtists}>
                  <Music size={20} />
                  <span>Manage Artists</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;