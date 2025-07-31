import React, { useState } from 'react';
import { ShoppingBag, Filter, Search, Disc } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Vinyl.css';

const Vinyl = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', 'Synthwave', 'Indie Rock', 'Dream Pop', 'Electronic', 'Alternative Rock', 'Ambient'];

  const vinylRecords = [
    {
      id: 1,
      title: 'Digital Horizons',
      artist: 'Neon Dreams',
      price: 34.99,
      genre: 'Synthwave',
      year: 2024,
      color: 'Purple Haze',
      limited: true,
      stock: 150,
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Limited edition purple vinyl featuring the hit album Digital Horizons'
    },
    {
      id: 2,
      title: 'Echoes in the Valley',
      artist: 'Echo Valley',
      price: 29.99,
      genre: 'Indie Rock',
      year: 2023,
      color: 'Clear with Gold Flakes',
      limited: false,
      stock: 300,
      image: 'https://images.pexels.com/photos/3721941/pexels-photo-3721941.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Stunning clear vinyl with gold flakes, showcasing Echo Valley\'s raw sound'
    },
    {
      id: 3,
      title: 'Static Dreams',
      artist: 'Luna Static',
      price: 39.99,
      genre: 'Dream Pop',
      year: 2024,
      color: 'Translucent Blue',
      limited: true,
      stock: 100,
      image: 'https://images.pexels.com/photos/4087993/pexels-photo-4087993.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Ultra-limited translucent blue vinyl of Luna Static\'s ethereal masterpiece'
    },
    {
      id: 4,
      title: 'Midnight Frequencies',
      artist: 'Midnight Pulse',
      price: 32.99,
      genre: 'Electronic',
      year: 2024,
      color: 'Glow in the Dark',
      limited: true,
      stock: 200,
      image: 'https://images.pexels.com/photos/1687341/pexels-photo-1687341.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Special glow-in-the-dark vinyl perfect for night listening sessions'
    },
    {
      id: 5,
      title: 'Thunder & Lightning',
      artist: 'Velvet Thunder',
      price: 27.99,
      genre: 'Alternative Rock',
      year: 2023,
      color: 'Classic Black',
      limited: false,
      stock: 500,
      image: 'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Classic black vinyl pressing of Velvet Thunder\'s powerful rock anthems'
    },
    {
      id: 6,
      title: 'Cosmic Winds',
      artist: 'Solar Winds',
      price: 36.99,
      genre: 'Ambient',
      year: 2024,
      color: 'Galaxy Splatter',
      limited: true,
      stock: 75,
      image: 'https://images.pexels.com/photos/1370545/pexels-photo-1370545.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Exclusive galaxy splatter vinyl - each record is unique'
    }
  ];

  const filteredRecords = vinylRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || record.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handleAddToCart = async (record) => {
    if (!user) {
      alert('Please log in to add vinyl to cart');
      return;
    }
    
    const result = await addToCart(record.id, 1);
    if (result && result.success) {
      alert('Vinyl added to cart!');
    } else if (result && result.error) {
      alert(result.error);
    }
  };

  return (
    <div className="vinyl-page">
      <div className="container">
        <div className="vinyl-header">
          <h1 className="page-title">
            <Disc className="title-icon" />
            Vinyl Collection
          </h1>
        </div>

        <div className="vinyl-filters">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search vinyl records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="genre-filter">
            <Filter size={16} />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="filter-select"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="vinyl-grid">
          {filteredRecords.map(record => (
            <div key={record.id} className="vinyl-card">
              <div className="vinyl-image">
                <img src={record.image} alt={`${record.title} vinyl`} />
                {record.limited && (
                  <div className="limited-badge">Limited Edition</div>
                )}
                <div className="vinyl-overlay">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(record)}
                    disabled={record.stock === 0}
                  >
                    <ShoppingBag size={16} />
                    {record.stock === 0 ? 'Sold Out' : 'Add to Cart'}
                  </button>
                </div>
              </div>
              
              <div className="vinyl-info">
                <div className="vinyl-artist">{record.artist}</div>
                <h3 className="vinyl-title">{record.title}</h3>
                <div className="vinyl-details">
                  <span className="vinyl-year">{record.year}</span>
                  <span className="vinyl-genre">{record.genre}</span>
                </div>
                <div className="vinyl-specs">
                  <div className="vinyl-color">{record.color} Vinyl</div>
                  <div className="vinyl-stock">
                    {record.stock > 0 ? `${record.stock} left` : 'Sold Out'}
                  </div>
                </div>
                <p className="vinyl-description">{record.description}</p>
                <div className="vinyl-price">${record.price}</div>
              </div>
            </div>
          ))}
        </div>

        {filteredRecords.length === 0 && (
          <div className="no-results">
            <Disc size={48} />
            <h3>No vinyl records found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vinyl;