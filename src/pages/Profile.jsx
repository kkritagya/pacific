import React, { useState } from 'react';
import { User, Mail, Calendar, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Music enthusiast and vinyl collector',
    favoriteGenres: ['Synthwave', 'Indie Rock', 'Dream Pop']
  });

  const handleSave = () => {
    // In a real app, this would update the user profile via API
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: 'Music enthusiast and vinyl collector',
      favoriteGenres: ['Synthwave', 'Indie Rock', 'Dream Pop']
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const recentActivity = [
    {
      id: 1,
      type: 'purchase',
      description: 'Purchased "Digital Horizons" vinyl by Neon Dreams',
      date: '2025-01-20',
      amount: '$34.99'
    },
    {
      id: 2,
      type: 'presave',
      description: 'Presaved "Neon Futures" by Neon Dreams',
      date: '2025-01-18'
    },
    {
      id: 3,
      type: 'ticket',
      description: 'Bought tickets for Echo Valley at The Underground',
      date: '2025-01-15',
      amount: '$35.00'
    },
    {
      id: 4,
      type: 'follow',
      description: 'Started following Luna Static',
      date: '2025-01-12'
    }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'purchase': return '🛍️';
      case 'presave': return '💾';
      case 'ticket': return '🎫';
      case 'follow': return '❤️';
      default: return '📝';
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={64} />
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user?.name}</h1>
            <p className="profile-email">{user?.email}</p>
            <p className="member-since">
              <Calendar size={16} />
              Member since {new Date(user?.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
              })}
            </p>
          </div>
          <div className="profile-actions">
            {isEditing ? (
              <div className="edit-actions">
                <button className="btn btn-primary" onClick={handleSave}>
                  <Save size={16} />
                  Save
                </button>
                <button className="btn btn-outline" onClick={handleCancel}>
                  <X size={16} />
                  Cancel
                </button>
              </div>
            ) : (
              <button className="btn btn-outline" onClick={() => setIsEditing(true)}>
                <Edit3 size={16} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-main">
            <section className="profile-section">
              <h2>Profile Information</h2>
              <div className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-display">{formData.name}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-display">{formData.email}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Bio</label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="form-textarea"
                      rows="3"
                    />
                  ) : (
                    <div className="form-display">{formData.bio}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label>Favorite Genres</label>
                  <div className="genre-tags">
                    {formData.favoriteGenres.map(genre => (
                      <span key={genre} className="genre-tag">{genre}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="profile-section">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="activity-content">
                      <p className="activity-description">{activity.description}</p>
                      <div className="activity-meta">
                        <span className="activity-date">
                          {new Date(activity.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        {activity.amount && (
                          <span className="activity-amount">{activity.amount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="profile-sidebar">
            <div className="stats-card">
              <h3>Your Stats</h3>
              <div className="stat-item">
                <span className="stat-number">12</span>
                <span className="stat-label">Vinyl Records</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">6</span>
                <span className="stat-label">Concert Tickets</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4</span>
                <span className="stat-label">Presaved Albums</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">8</span>
                <span className="stat-label">Followed Artists</span>
              </div>
            </div>

            <div className="danger-zone">
              <h3>Account Actions</h3>
              <button className="btn btn-outline" onClick={logout}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;