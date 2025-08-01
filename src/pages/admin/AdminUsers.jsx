import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Users, 
  Eye, 
  Shield,
  ArrowLeft,
  RefreshCw,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminFilter, setAdminFilter] = useState('all');
  const [updatingUser, setUpdatingUser] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:5000';

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);
        } else {
          setError('Failed to fetch users');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  // Mock users fallback
  const mockUsers = [
    {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      isAdmin: false,
      createdAt: '2025-01-15'
    }
  ];

  // Use real users from backend or fallback to mock data
  const displayUsers = users.length > 0 ? users : mockUsers;

  const filteredUsers = displayUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAdmin = adminFilter === 'all' || 
                        (adminFilter === 'admin' && user.isAdmin) ||
                        (adminFilter === 'user' && !user.isAdmin);
    return matchesSearch && matchesAdmin;
  });

  // Handle toggle admin status
  const handleToggleAdmin = async (userId) => {
    if (!token) return;
    
    try {
      setUpdatingUser(userId);
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/toggle-admin`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Refresh users
        const refreshResponse = await fetch(`${API_BASE_URL}/admin/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          setUsers(data.users || []);
        }
      } else {
        alert('Failed to update user admin status');
      }
    } catch (err) {
      alert('Error updating user admin status');
    } finally {
      setUpdatingUser(null);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchUsers();
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  if (loading) {
    return (
      <div className="admin-users">
        <div className="container">
          <div className="loading-state">
            <h2>Loading users...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-users">
        <div className="container">
          <div className="error-state">
            <h2>Error: {error}</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-users">
      <div className="container">
        <div className="users-header">
          <div className="header-content">
            <button className="back-btn" onClick={handleBack}>
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="page-title">User Management</h1>
              <p className="page-subtitle">
                Manage user accounts and permissions
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={handleRefresh}>
              <RefreshCw size={16} />
              Refresh
            </button>
            <button className="btn btn-primary">
              <UserPlus size={16} />
              Add User
            </button>
          </div>
        </div>

        <div className="users-stats">
          <div className="stat-card">
            <Users className="stat-icon" size={24} />
            <div className="stat-content">
              <div className="stat-value">{filteredUsers.length}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>
          <div className="stat-card">
            <Shield className="stat-icon" size={24} />
            <div className="stat-content">
              <div className="stat-value">{filteredUsers.filter(u => u.isAdmin).length}</div>
              <div className="stat-label">Admin Users</div>
            </div>
          </div>
        </div>

        <div className="users-filters">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <div className="filter-item">
              <Filter size={16} />
              <select
                value={adminFilter}
                onChange={(e) => setAdminFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Users</option>
                <option value="admin">Admin Only</option>
                <option value="user">Regular Users</option>
              </select>
            </div>
          </div>
        </div>

        <div className="users-table">
          <div className="table-header">
            <div className="table-cell">User ID</div>
            <div className="table-cell">Name</div>
            <div className="table-cell">Email</div>
            <div className="table-cell">Role</div>
            <div className="table-cell">Joined</div>
            <div className="table-cell">Actions</div>
          </div>

          {filteredUsers.map(user => (
            <div key={user.id} className="table-row">
              <div className="table-cell">
                <div className="user-id">#{user.id}</div>
              </div>
              
              <div className="table-cell">
                <div className="user-name">{user.name}</div>
              </div>
              
              <div className="table-cell">
                <div className="user-email">{user.email}</div>
              </div>
              
              <div className="table-cell">
                <span className={`role-badge ${user.isAdmin ? 'admin' : 'user'}`}>
                  {user.isAdmin ? 'Admin' : 'User'}
                </span>
              </div>
              
              <div className="table-cell">
                <div className="user-date">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="table-cell">
                <div className="actions">
                  <button className="action-btn" title="View Details">
                    <Eye size={16} />
                  </button>
                  <button 
                    className={`action-btn ${user.isAdmin ? 'admin-active' : ''}`}
                    onClick={() => handleToggleAdmin(user.id)}
                    disabled={updatingUser === user.id}
                    title={user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                  >
                    <Shield size={16} />
                  </button>
                  {updatingUser === user.id && (
                    <RefreshCw size={16} className="spinning" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="no-results">
            <Users size={48} />
            <h3>No users found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers; 