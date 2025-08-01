import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit,
  MoreHorizontal,
  Calendar,
  Package,
  DollarSign,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  Trash2,
  MoreVertical
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminOrders.css';

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [showActions, setShowActions] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:5000';

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/admin/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        } else {
          setError('Failed to fetch orders');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  // Mock orders fallback
  // Use real orders from backend
  const displayOrders = orders;

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' }
  ];

  const filteredOrders = displayOrders.filter(order => {
    const matchesSearch = order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.User?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.User?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const getTotalRevenue = () => {
    return filteredOrders
      .filter(order => order.status !== 'cancelled')
      .reduce((sum, order) => {
        const total = parseFloat(order.total);
        return sum + (isNaN(total) ? 0 : total);
      }, 0);
  };

  const getOrdersByStatus = (status) => {
    return filteredOrders.filter(order => order.status === status).length;
  };



  // Handle export
  const handleExport = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Email', 'Items', 'Total', 'Status', 'Date'],
      ...filteredOrders.map(order => [
        order.id,
        order.customer?.name || 'N/A',
        order.customer?.email || 'N/A',
        order.items?.map(item => `${item.name} (${item.quantity})`).join(', ') || 'N/A',
        `$${(() => {
          const total = parseFloat(order.total);
          return isNaN(total) ? '0.00' : total.toFixed(2);
        })()}`,
        order.status,
        new Date(order.date || order.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchOrders();
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    if (!token) return;
    
    try {
      setUpdatingOrder(orderId);
      const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update the order in the local state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId 
              ? { ...order, status: newStatus }
              : order
          )
        );
        setShowActions(null);
      } else {
        const errorData = await response.json();
        alert(`Failed to update status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Network error while updating status');
    } finally {
      setUpdatingOrder(null);
    }
  };

  // Handle order removal (only for completed orders)
  const handleRemoveOrder = async (orderId) => {
    if (!token) {
      alert('No authentication token available');
      return;
    }
    
    if (!window.confirm('Are you sure you want to remove this completed order? This action cannot be undone.')) {
      return;
    }
    
    try {
      setUpdatingOrder(orderId);
      console.log('Attempting to delete order:', orderId);
      console.log('Token available:', !!token);
      
      const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        // Remove the order from the local state
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        setShowActions(null);
        alert('Order removed successfully!');
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        alert(`Failed to remove order: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Network error:', err);
      alert('Network error while removing order');
    } finally {
      setUpdatingOrder(null);
    }
  };

  // Toggle actions menu
  const toggleActions = (orderId) => {
    setShowActions(showActions === orderId ? null : orderId);
  };

  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showActions && !event.target.closest('.actions-dropdown')) {
        setShowActions(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

  if (loading) {
    return (
      <div className="admin-orders">
        <div className="container">
          <div className="loading-state">
            <h2>Loading orders...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-orders">
        <div className="container">
          <div className="error-state">
            <h2>Error: {error}</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="container">
        <div className="orders-header">
          <div className="header-content">
            <button className="back-btn" onClick={handleBack}>
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="page-title">Order Management</h1>
              <p className="page-subtitle">
                Manage and track all customer orders
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={handleRefresh}>
              <RefreshCw size={16} />
              Refresh
            </button>
            <button className="btn btn-outline" onClick={handleExport}>
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        <div className="orders-stats">
          <div className="stat-card">
            <DollarSign className="stat-icon" size={24} />
            <div className="stat-content">
              <div className="stat-value">${getTotalRevenue().toFixed(2)}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>
          <div className="stat-card">
            <Package className="stat-icon" size={24} />
            <div className="stat-content">
              <div className="stat-value">{filteredOrders.length}</div>
              <div className="stat-label">Total Orders</div>
            </div>
          </div>
          <div className="stat-card">
            <Calendar className="stat-icon" size={24} />
            <div className="stat-content">
              <div className="stat-value">{getOrdersByStatus('pending')}</div>
              <div className="stat-label">Pending Orders</div>
            </div>
          </div>
        </div>

        <div className="orders-filters">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search orders, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <div className="filter-item">
              <Filter size={16} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <Calendar size={16} />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="filter-select"
              >
                {dateOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="orders-table">
          <div className="table-header">
            <div className="table-cell">Order ID</div>
            <div className="table-cell">Customer</div>
            <div className="table-cell">Items</div>
            <div className="table-cell">Total</div>
            <div className="table-cell">Status</div>
            <div className="table-cell">Date</div>
            <div className="table-cell">Actions</div>
          </div>

          {filteredOrders.map(order => (
            <div key={order.id} className="table-row">
              <div className="table-cell">
                <div className="order-id">{order.id}</div>
              </div>
              
              <div className="table-cell">
                <div className="customer-info">
                  <div className="customer-name">{order.User?.name || 'N/A'}</div>
                  <div className="customer-email">{order.User?.email || 'N/A'}</div>
                </div>
              </div>
              
              <div className="table-cell">
                <div className="order-items">
                  {order.OrderItems?.map((item, index) => (
                    <div key={index} className="item-line">
                      {item.quantity}x {item.Product?.name || 'Unknown Product'}
                      {order.OrderItems.length > 1 && index < order.OrderItems.length - 1 && <br />}
                    </div>
                  )) || 'No items'}
                </div>
              </div>
              
              <div className="table-cell">
                <div className="order-total">
                  ${(() => {
                    const total = parseFloat(order.total);
                    return isNaN(total) ? '0.00' : total.toFixed(2);
                  })()}
                </div>
              </div>
              
              <div className="table-cell">
                <span className={`status-badge status-${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)} {order.status}
                </span>
              </div>
              
              <div className="table-cell">
                <div className="order-date">
                  {new Date(order.createdAt || order.date).toLocaleDateString()}
                </div>
              </div>
              
              <div className="table-cell">
                <div className="actions">
                  <button className="action-btn" title="View Details">
                    <Eye size={16} />
                  </button>
                  
                  <div className="actions-dropdown">
                    <button 
                      className="action-btn" 
                      onClick={() => toggleActions(order.id)}
                      disabled={updatingOrder === order.id}
                    >
                      {updatingOrder === order.id ? (
                        <RefreshCw size={16} className="spinning" />
                      ) : (
                        <MoreVertical size={16} />
                      )}
                    </button>
                    
                    {showActions === order.id && (
                      <div className="actions-menu">
                        {/* Always show "Mark as Complete" for non-completed orders */}
                        {order.status !== 'completed' && (
                          <button 
                            className="action-menu-item"
                            onClick={() => handleStatusUpdate(order.id, 'completed')}
                          >
                            <CheckCircle size={16} />
                            Mark as Complete
                          </button>
                        )}
                        
                        {/* Show "Mark as Processing" only for pending orders */}
                        {order.status === 'pending' && (
                          <button 
                            className="action-menu-item"
                            onClick={() => handleStatusUpdate(order.id, 'processing')}
                          >
                            <Edit size={16} />
                            Mark as Processing
                          </button>
                        )}
                        
                        {/* Show "Mark as Shipped" only for processing orders */}
                        {order.status === 'processing' && (
                          <button 
                            className="action-menu-item"
                            onClick={() => handleStatusUpdate(order.id, 'shipped')}
                          >
                            <Package size={16} />
                            Mark as Shipped
                          </button>
                        )}
                        
                        {/* Show "Remove Order" only for completed orders */}
                        {order.status === 'completed' && (
                          <button 
                            className="action-menu-item action-menu-item-danger"
                            onClick={() => handleRemoveOrder(order.id)}
                          >
                            <Trash2 size={16} />
                            Remove Order
                          </button>
                        )}
                      </div>
                    )}
                    
                    
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="no-results">
            <Package size={48} />
            <h3>No orders found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;