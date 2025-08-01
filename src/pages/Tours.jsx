import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Ticket, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Tours.css';

const Tours = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [selectedArtist, setSelectedArtist] = useState('All');

  const artists = ['All', 'Drake', 'Taylor Swift', 'Arctic Monkeys', 'ODESZA', 'Miles Davis'];

  const tourDates = [
    // Drake
    {
      id: 1,
      artist: 'Drake',
      venue: 'Scotiabank Arena',
      location: 'Toronto, ON',
      date: '2025-04-10',
      time: '8:00 PM',
      price: 120,
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Drake returns to his hometown for a massive arena show.',
      ticketsLeft: 200
    },
    {
      id: 6,
      artist: 'Drake',
      venue: 'Barclays Center',
      location: 'Brooklyn, NY',
      date: '2025-04-18',
      time: '8:30 PM',
      price: 110,
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Drake brings his hits to Brooklyn.',
      ticketsLeft: 150
    },
    {
      id: 7,
      artist: 'Drake',
      venue: 'Staples Center',
      location: 'Los Angeles, CA',
      date: '2025-04-25',
      time: '9:00 PM',
      price: 130,
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Drake live in LA for one night only.',
      ticketsLeft: 180
    },
    // Taylor Swift
    {
      id: 2,
      artist: 'Taylor Swift',
      venue: 'Wembley Stadium',
      location: 'London, UK',
      date: '2025-05-15',
      time: '7:30 PM',
      price: 150,
      image: 'https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Taylor Swift brings her chart-topping hits to London.',
      ticketsLeft: 0
    },
    {
      id: 8,
      artist: 'Taylor Swift',
      venue: 'MetLife Stadium',
      location: 'East Rutherford, NJ',
      date: '2025-05-22',
      time: '8:00 PM',
      price: 145,
      image: 'https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Taylor Swift lights up New Jersey.',
      ticketsLeft: 100
    },
    {
      id: 9,
      artist: 'Taylor Swift',
      venue: 'Accor Arena',
      location: 'Paris, France',
      date: '2025-06-05',
      time: '7:00 PM',
      price: 160,
      image: 'https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'A magical night with Taylor Swift in Paris.',
      ticketsLeft: 80
    },
    // Arctic Monkeys
    {
      id: 3,
      artist: 'Arctic Monkeys',
      venue: 'Madison Square Garden',
      location: 'New York, NY',
      date: '2025-06-01',
      time: '8:00 PM',
      price: 95,
      image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Arctic Monkeys rock the iconic MSG stage.',
      ticketsLeft: 75
    },
    {
      id: 10,
      artist: 'Arctic Monkeys',
      venue: 'O2 Arena',
      location: 'London, UK',
      date: '2025-06-10',
      time: '8:30 PM',
      price: 100,
      image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Arctic Monkeys headline the O2.',
      ticketsLeft: 90
    },
    {
      id: 11,
      artist: 'Arctic Monkeys',
      venue: 'Sydney Opera House',
      location: 'Sydney, Australia',
      date: '2025-06-20',
      time: '7:00 PM',
      price: 110,
      image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'A special show down under.',
      ticketsLeft: 60
    },
    // ODESZA
    {
      id: 4,
      artist: 'ODESZA',
      venue: 'Red Rocks Amphitheatre',
      location: 'Morrison, CO',
      date: '2025-07-20',
      time: '9:00 PM',
      price: 80,
      image: 'https://images.pexels.com/photos/1652340/pexels-photo-1652340.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'ODESZA delivers an unforgettable electronic set under the stars.',
      ticketsLeft: 120
    },
    {
      id: 12,
      artist: 'ODESZA',
      venue: 'The Gorge',
      location: 'George, WA',
      date: '2025-07-28',
      time: '8:00 PM',
      price: 85,
      image: 'https://images.pexels.com/photos/1652340/pexels-photo-1652340.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'ODESZA at the breathtaking Gorge Amphitheatre.',
      ticketsLeft: 110
    },
    {
      id: 13,
      artist: 'ODESZA',
      venue: 'Greek Theatre',
      location: 'Berkeley, CA',
      date: '2025-08-05',
      time: '8:30 PM',
      price: 90,
      image: 'https://images.pexels.com/photos/1652340/pexels-photo-1652340.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'ODESZA brings the beats to Berkeley.',
      ticketsLeft: 95
    },
    // Miles Davis
    {
      id: 5,
      artist: 'Miles Davis',
      venue: 'Blue Note Jazz Club',
      location: 'New York, NY',
      date: '2025-08-05',
      time: '8:30 PM',
      price: 60,
      image: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'A night of classic jazz with the legendary Miles Davis.',
      ticketsLeft: 30
    },
    {
      id: 14,
      artist: 'Miles Davis',
      venue: 'SFJAZZ Center',
      location: 'San Francisco, CA',
      date: '2025-08-12',
      time: '9:00 PM',
      price: 70,
      image: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Miles Davis performs in San Francisco.',
      ticketsLeft: 40
    },
    {
      id: 15,
      artist: 'Miles Davis',
      venue: 'Montreux Jazz Festival',
      location: 'Montreux, Switzerland',
      date: '2025-08-20',
      time: '8:00 PM',
      price: 100,
      image: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Miles Davis headlines the world-famous jazz festival.',
      ticketsLeft: 20
    }
  ];

  const filteredTours = selectedArtist === 'All' 
    ? tourDates 
    : tourDates.filter(tour => tour.artist === selectedArtist);

  const handleBuyTicket = async (show) => {
    if (!user) {
      alert('Please log in to buy tickets');
      return;
    }
    
    if (show.ticketsLeft === 0) {
      alert('Sorry, this show is sold out!');
      return;
    }

    const result = await addToCart(show.id, 1);
    if (result && result.success) {
      alert('Ticket added to cart!');
    } else if (result && result.error) {
      alert(result.error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      day: date.getDate(),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' })
    };
  };

  return (
    <div className="tours-page">
      <div className="container">
        <div className="tours-header">
          <h1 className="page-title">
            <Calendar className="title-icon" />
            Tour Dates
          </h1>
        </div>

        <div className="tours-filter">
          <div className="artist-filter">
            <Filter size={16} />
            <select
              value={selectedArtist}
              onChange={(e) => setSelectedArtist(e.target.value)}
              className="filter-select"
            >
              {artists.map(artist => (
                <option key={artist} value={artist}>
                  {artist === 'All' ? 'All Artists' : artist}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="tours-grid">
          {filteredTours.map(show => {
            const dateInfo = formatDate(show.date);
            const isComingSoon = new Date(show.date) > new Date();
            const isSoldOut = show.ticketsLeft === 0;

            return (
              <div key={show.id} className={`tour-card ${isSoldOut ? 'sold-out' : ''}`}>
                <div className="tour-image">
                  <img src={show.image} alt={show.artist} />
                  {isSoldOut && (
                    <div className="sold-out-badge">Sold Out</div>
                  )}
                  <div className="tour-date-badge">
                    <div className="date-month">{dateInfo.month}</div>
                    <div className="date-day">{dateInfo.day}</div>
                  </div>
                </div>
                
                <div className="tour-info">
                  <div className="tour-artist">{show.artist}</div>
                  <h3 className="tour-venue">{show.venue}</h3>
                  
                  <div className="tour-details">
                    <div className="detail-item">
                      <MapPin size={16} />
                      <span>{show.location}</span>
                    </div>
                    <div className="detail-item">
                      <Clock size={16} />
                      <span>{show.time}</span>
                    </div>
                    <div className="detail-item">
                      <Ticket size={16} />
                      <span>
                        {isSoldOut ? 'Sold Out' : `${show.ticketsLeft} tickets left`}
                      </span>
                    </div>
                  </div>
                  
                  <p className="tour-description">{show.description}</p>
                  
                  <div className="tour-footer">
                    <div className="tour-price">
                      From <span className="price-amount">${show.price}</span>
                    </div>
                    <button 
                      className={`btn ${isSoldOut ? 'btn-disabled' : 'btn-secondary'}`}
                      onClick={() => handleBuyTicket(show)}
                      disabled={isSoldOut}
                    >
                      {isSoldOut ? 'Sold Out' : 'Buy Tickets'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTours.length === 0 && (
          <div className="no-results">
            <Calendar size={48} />
            <h3>No tour dates found</h3>
            <p>Try selecting a different artist filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tours;