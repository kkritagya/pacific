import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Users, Disc, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirect admin users to their dashboard
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, navigate]);
  const featuredArtists = [
    {
      id: 1,
      name: 'Neon Dreams',
      genre: 'Synthwave',
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Electronic music that takes you to another dimension'
    },
    {
      id: 2,
      name: 'Echo Valley',
      genre: 'Indie Rock',
      image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Raw emotion meets melodic storytelling'
    },
    {
      id: 3,
      name: 'Luna Static',
      genre: 'Dream Pop',
      image: 'https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Ethereal sounds that float through consciousness'
    }
  ];

  const stats = [
    { icon: Users, value: '50+', label: 'Artists Signed' },
    { icon: Disc, value: '200+', label: 'Albums Released' },
    { icon: Calendar, value: '500+', label: 'Shows Played' },
    { icon: Play, value: '10M+', label: 'Streams' }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Discover the Sound of Tomorrow
            </h1>
            <p className="hero-subtitle">
              Pacific Records - Where emerging artists meet their audience. 
              Experience music that pushes boundaries and defines the future.
            </p>
            <div className="hero-actions">
              <Link to="/artists" className="btn btn-primary">
                Explore Artists
              </Link>
              <Link to="/vinyl" className="btn btn-outline">
                Shop Vinyl
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image">
              <img 
                src="https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Music Production"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <stat.icon className="stat-icon" size={32} />
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="featured-section section">
        <div className="container">
          <h2 className="section-title">Featured Artists</h2>
          <p className="section-subtitle">
            Meet the talented musicians shaping the future of music
          </p>
          
          <div className="artists-grid">
            {featuredArtists.map(artist => (
              <div key={artist.id} className="artist-card">
                <div className="artist-image">
                  <img src={artist.image} alt={artist.name} />
                  <div className="artist-overlay">
                    <Link to={`/artists/${artist.id}`} className="btn btn-primary">
                      View Profile
                    </Link>
                  </div>
                </div>
                <div className="artist-info">
                  <h3 className="artist-name">{artist.name}</h3>
                  <p className="artist-genre">{artist.genre}</p>
                  <p className="artist-description">{artist.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Explore?</h2>
            <p className="cta-subtitle">
              Join thousands of music lovers discovering their next favorite artist
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-secondary">
                Join Pacific
              </Link>
              <Link to="/tours" className="btn btn-outline">
                Find Shows
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;