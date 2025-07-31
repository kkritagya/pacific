import React, { useState } from 'react';
import { ShoppingBag, Filter, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Merch.css';

const Merch = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'T-Shirts', 'Hoodies', 'Accessories', 'Posters'];

  const merchItems = [
    {
      id: 1,
      name: 'Pacific Records T-Shirt',
      price: 29.99,
      category: 'T-Shirts',
      artist: 'Pacific Records',
      image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Classic Pacific Records logo tee in premium cotton'
    },
    {
      id: 2,
      name: 'Neon Dreams Synthwave Hoodie',
      price: 59.99,
      category: 'Hoodies',
      artist: 'Neon Dreams',
      image: 'https://images.pexels.com/photos/8532611/pexels-photo-8532611.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Ultra-soft hoodie with retro synthwave design'
    },
    {
      id: 3,
      name: 'Echo Valley Band Tee',
      price: 32.99,
      category: 'T-Shirts',
      artist: 'Echo Valley',
      image: 'https://images.pexels.com/photos/8532620/pexels-photo-8532620.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Vintage-style band tee with tour dates'
    },
    {
      id: 4,
      name: 'Luna Static Enamel Pin Set',
      price: 19.99,
      category: 'Accessories',
      artist: 'Luna Static',
      image: 'https://images.pexels.com/photos/8078215/pexels-photo-8078215.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Limited edition enamel pins (set of 3)'
    },
    {
      id: 5,
      name: 'Midnight Pulse Concert Poster',
      price: 24.99,
      category: 'Posters',
      artist: 'Midnight Pulse',
      image: 'https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'High-quality print of exclusive concert artwork'
    },
    {
      id: 6,
      name: 'Velvet Thunder Leather Jacket',
      price: 149.99,
      category: 'Hoodies',
      artist: 'Velvet Thunder',
      image: 'https://images.pexels.com/photos/1449667/pexels-photo-1449667.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Premium leather jacket with band logo'
    }
  ];

  const filteredItems = merchItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = async (item) => {
    if (!user) {
      alert('Please log in to add items to cart');
      return;
    }
    
    const result = await addToCart(item.id, 1);
    if (result && result.success) {
      alert('Item added to cart!');
    } else if (result && result.error) {
      alert(result.error);
    }
  };

  return (
    <div className="merch-page">
      <div className="container">
        <div className="merch-header">
          <h1 className="page-title">Merchandise</h1>
        </div>

        <div className="merch-filters">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search merchandise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filter">
            <Filter size={16} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="merch-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="merch-card">
              <div className="merch-image">
                <img src={item.image} alt={item.name} />
                <div className="merch-overlay">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingBag size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
              
              <div className="merch-info">
                <div className="merch-artist">{item.artist}</div>
                <h3 className="merch-name">{item.name}</h3>
                <p className="merch-description">{item.description}</p>
                <div className="merch-price">${item.price}</div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="no-results">
            <h3>No merchandise found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Merch;