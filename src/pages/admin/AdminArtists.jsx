import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Music, 
  Eye, 
  Edit,
  Trash2,
  Plus,
  ArrowLeft,
  RefreshCw,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminArtists.css';

const AdminArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [editingArtist, setEditingArtist] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingArtist, setDeletingArtist] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:5000';

  // Form state for adding/editing
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    bio: '',
    image: '',
    featured: false
  });

  // Fetch artists from backend
  useEffect(() => {
    const fetchArtists = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/artists`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setArtists(data || []);
        } else {
          setError('Failed to fetch artists');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [token]);

  // Mock artists fallback
  const mockArtists = [
    {
      id: 1,
      name: 'Neon Dreams',
      genre: 'Synthwave',
      bio: 'Electronic synthwave artist',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      featured: true
    }
  ];

  // Use real artists from backend or fallback to mock data
  const displayArtists = artists.length > 0 ? artists : mockArtists;

  const filteredArtists = displayArtists.filter(artist => {
    const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artist.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === 'all' || artist.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  // Get unique genres for filter
  const genres = ['all', ...new Set(displayArtists.map(artist => artist.genre))];

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle add artist
  const handleAddArtist = async (e) => {
    e.preventDefault();
    if (!token) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/artists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newArtist = await response.json();
        setArtists(prev => [...prev, newArtist]);
        setShowAddForm(false);
        setFormData({ name: '', genre: '', bio: '', image: '', featured: false });
        alert('Artist added successfully!');
      } else {
        alert('Failed to add artist');
      }
    } catch (err) {
      alert('Error adding artist');
    }
  };

  // Handle edit artist
  const handleEditArtist = async (e) => {
    e.preventDefault();
    if (!token || !editingArtist) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/artists/${editingArtist.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedArtist = await response.json();
        setArtists(prev => prev.map(artist => 
          artist.id === editingArtist.id ? updatedArtist : artist
        ));
        setEditingArtist(null);
        setFormData({ name: '', genre: '', bio: '', image: '', featured: false });
        alert('Artist updated successfully!');
      } else {
        alert('Failed to update artist');
      }
    } catch (err) {
      alert('Error updating artist');
    }
  };

  // Handle delete artist
  const handleDeleteArtist = async (artistId) => {
    if (!token) return;
    
    if (!confirm('Are you sure you want to delete this artist?')) return;
    
    try {
      setDeletingArtist(artistId);
      const response = await fetch(`${API_BASE_URL}/artists/${artistId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setArtists(prev => prev.filter(artist => artist.id !== artistId));
        alert('Artist deleted successfully!');
      } else {
        alert('Failed to delete artist');
      }
    } catch (err) {
      alert('Error deleting artist');
    } finally {
      setDeletingArtist(null);
    }
  };

  // Start editing artist
  const startEdit = (artist) => {
    setEditingArtist(artist);
    setFormData({
      name: artist.name,
      genre: artist.genre,
      bio: artist.bio,
      image: artist.image,
      featured: artist.featured
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingArtist(null);
    setFormData({ name: '', genre: '', bio: '', image: '', featured: false });
  };

  // Handle refresh
  const handleRefresh = () => {
    window.location.reload();
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/admin/dashboard');
  };

  if (loading) {
    return (
      <div className="admin-artists">
        <div className="container">
          <div className="loading-state">
            <h2>Loading artists...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-artists">
        <div className="container">
          <div className="error-state">
            <h2>Error: {error}</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-artists">
      <div className="container">
        <div className="artists-header">
          <div className="header-content">
            <button className="back-btn" onClick={handleBack}>
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="page-title">Artist Management</h1>
              <p className="page-subtitle">
                Manage artists and their information
              </p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-outline" onClick={handleRefresh}>
              <RefreshCw size={16} />
              Refresh
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={16} />
              Add Artist
            </button>
          </div>
        </div>

        <div className="artists-stats">
          <div className="stat-card">
            <Music className="stat-icon" size={24} />
            <div className="stat-content">
              <div className="stat-value">{filteredArtists.length}</div>
              <div className="stat-label">Total Artists</div>
            </div>
          </div>
          <div className="stat-card">
            <Music className="stat-icon" size={24} />
            <div className="stat-content">
              <div className="stat-value">{filteredArtists.filter(a => a.featured).length}</div>
              <div className="stat-label">Featured Artists</div>
            </div>
          </div>
        </div>

        <div className="artists-filters">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <div className="filter-item">
              <Filter size={16} />
              <select
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
                className="filter-select"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre === 'all' ? 'All Genres' : genre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add Artist Form */}
        {showAddForm && (
          <div className="artist-form-overlay">
            <div className="artist-form">
              <div className="form-header">
                <h3>Add New Artist</h3>
                <button 
                  className="close-btn" 
                  onClick={() => setShowAddForm(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddArtist}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Genre</label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleFormChange}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleFormChange}
                    />
                    Featured Artist
                  </label>
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Add Artist
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Artist Form */}
        {editingArtist && (
          <div className="artist-form-overlay">
            <div className="artist-form">
              <div className="form-header">
                <h3>Edit Artist</h3>
                <button className="close-btn" onClick={cancelEdit}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleEditArtist}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Genre</label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleFormChange}
                    rows="3"
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleFormChange}
                    />
                    Featured Artist
                  </label>
                </div>
                <div className="form-actions">
                  <button type="button" onClick={cancelEdit}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="artists-grid">
          {filteredArtists.map(artist => (
            <div key={artist.id} className="artist-card">
              <div className="artist-image">
                <img src={artist.image} alt={artist.name} />
                {artist.featured && (
                  <div className="featured-badge">Featured</div>
                )}
              </div>
              <div className="artist-info">
                <h3 className="artist-name">{artist.name}</h3>
                <p className="artist-genre">{artist.genre}</p>
                <p className="artist-bio">{artist.bio}</p>
              </div>
              <div className="artist-actions">
                <button 
                  className="action-btn" 
                  onClick={() => startEdit(artist)}
                  title="Edit Artist"
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="action-btn delete" 
                  onClick={() => handleDeleteArtist(artist.id)}
                  disabled={deletingArtist === artist.id}
                  title="Delete Artist"
                >
                  {deletingArtist === artist.id ? (
                    <RefreshCw size={16} className="spinning" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredArtists.length === 0 && (
          <div className="no-results">
            <Music size={48} />
            <h3>No artists found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminArtists; 