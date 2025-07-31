import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Users, Calendar, Music, ShoppingBag, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ArtistDetail.css';

const ArtistDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();

  // Mock artist data - in real app, this would be fetched based on ID
  const artist = {
    id: parseInt(id),
    name: 'Neon Dreams',
    genre: 'Synthwave',
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    bio: 'Neon Dreams emerged from the underground electronic scene with a vision to blend nostalgic 80s aesthetics with cutting-edge modern production. Their ethereal soundscapes and pulsating rhythms have captivated audiences worldwide, creating an immersive experience that transcends time and space.',
    monthlyListeners: '2.5M',
    upcomingShows: 8,
    albums: 3,
    topTracks: [
      { id: 1, title: 'Midnight Runner', plays: '15.2M', duration: '4:23' },
      { id: 2, title: 'Electric Dreams', plays: '12.8M', duration: '3:45' },
      { id: 3, title: 'Cyber Love', plays: '9.1M', duration: '5:12' },
      { id: 4, title: 'Neon Nights', plays: '7.9M', duration: '4:01' },
      { id: 5, title: 'Retrowave', plays: '6.3M', duration: '3:33' }
    ],
    merch: [
      {
        id: 1,
        name: 'Neon Dreams T-Shirt',
        price: 29.99,
        image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=300',
        type: 'merch'
      },
      {
        id: 2,
        name: 'Synthwave Hoodie',
        price: 59.99,
        image: 'https://images.pexels.com/photos/8532611/pexels-photo-8532611.jpeg?auto=compress&cs=tinysrgb&w=300',
        type: 'merch'
      }
    ],
    upcomingTours: [
      { id: 1, date: '2025-02-15', venue: 'Electric Palace, Los Angeles', price: 45 },
      { id: 2, date: '2025-02-18', venue: 'Neon Club, San Francisco', price: 38 },
      { id: 3, date: '2025-02-22', venue: 'Cyber Arena, Seattle', price: 42 }
    ]
  };

  const handleAddToCart = (item) => {
    if (!user) {
      alert('Please log in to add items to cart');
      return;
    }
    addToCart(item);
  };

  const handleBuyTicket = (show) => {
    if (!user) {
      alert('Please log in to buy tickets');
      return;
    }
    addToCart({
      id: show.id,
      name: `${artist.name} - ${show.venue}`,
      price: show.price,
      image: artist.image,
      type: 'ticket',
      date: show.date
    });
  };

  return (
    <div className="artist-detail-page">
      {/* Hero Section */}
      <section className="artist-hero">
        <div className="hero-background">
          <img src={artist.image} alt={artist.name} />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <div className="artist-info">
              <span className="artist-genre">{artist.genre}</span>
              <h1 className="artist-name">{artist.name}</h1>
              <div className="artist-stats">
                <div className="stat">
                  <Users size={20} />
                  <span>{artist.monthlyListeners} monthly listeners</span>
                </div>
                <div className="stat">
                  <Calendar size={20} />
                  <span>{artist.upcomingShows} upcoming shows</span>
                </div>
                <div className="stat">
                  <Music size={20} />
                  <span>{artist.albums} albums</span>
                </div>
              </div>
              <div className="artist-actions">
                <button className="btn btn-primary">
                  <Play size={16} />
                  Play
                </button>
                <button className="btn btn-outline">
                  <Heart size={16} />
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* About Section */}
        <section className="artist-about section">
          <h2 className="section-title">About</h2>
          <p className="artist-bio">{artist.bio}</p>
        </section>

        {/* Top Tracks */}
        <section className="top-tracks section">
          <h2 className="section-title">Popular Tracks</h2>
          <div className="tracks-list">
            {artist.topTracks.map((track, index) => (
              <div key={track.id} className="track-item">
                <div className="track-number">{index + 1}</div>
                <div className="track-info">
                  <h4 className="track-title">{track.title}</h4>
                  <p className="track-stats">{track.plays} plays • {track.duration}</p>
                </div>
                <button className="track-play">
                  <Play size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Merchandise */}
        <section className="artist-merch section">
          <h2 className="section-title">Merchandise</h2>
          <div className="merch-grid">
            {artist.merch.map(item => (
              <div key={item.id} className="merch-card">
                <div className="merch-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="merch-info">
                  <h4 className="merch-name">{item.name}</h4>
                  <p className="merch-price">${item.price}</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingBag size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="merch-cta">
            <Link to="/merch" className="btn btn-outline">
              View All Merchandise
            </Link>
          </div>
        </section>

        {/* Upcoming Tours */}
        <section className="artist-tours section">
          <h2 className="section-title">Upcoming Shows</h2>
          <div className="tours-list">
            {artist.upcomingTours.map(show => (
              <div key={show.id} className="tour-item">
                <div className="tour-date">
                  <div className="date-month">
                    {new Date(show.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="date-day">
                    {new Date(show.date).getDate()}
                  </div>
                </div>
                <div className="tour-info">
                  <h4 className="tour-venue">{show.venue}</h4>
                  <p className="tour-price">From ${show.price}</p>
                </div>
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleBuyTicket(show)}
                >
                  Buy Tickets
                </button>
              </div>
            ))}
          </div>
          <div className="tours-cta">
            <Link to="/tours" className="btn btn-outline">
              View All Tours
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ArtistDetail;