import React, { useState } from 'react';
import { Music, Calendar, Heart, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Presave.css';

const Presave = () => {
  const { user } = useAuth();
  const [presavedAlbums, setPresavedAlbums] = useState([]);

  const upcomingReleases = [
    {
      id: 1,
      title: 'Neon Futures',
      artist: 'Neon Dreams',
      releaseDate: '2025-03-15',
      genre: 'Synthwave',
      description: 'The highly anticipated follow-up to Digital Horizons, featuring 12 tracks of pure synthwave bliss.',
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=500',
      trackCount: 12,
      duration: '48:32',
      previewTrack: 'Cyber Highway'
    },
    {
      id: 2,
      title: 'Echoes Fade',
      artist: 'Echo Valley',
      releaseDate: '2025-04-02',
      genre: 'Indie Rock',
      description: 'An emotional journey through loss and redemption, showcasing Echo Valley\'s most personal work yet.',
      image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=500',
      trackCount: 10,
      duration: '42:18',
      previewTrack: 'Fade Away'
    },
    {
      id: 3,
      title: 'Moonlit Reveries',
      artist: 'Luna Static',
      releaseDate: '2025-04-20',
      genre: 'Dream Pop',
      description: 'Ethereal soundscapes that transport listeners to a world of dreams and wonder.',
      image: 'https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=500',
      trackCount: 8,
      duration: '36:45',
      previewTrack: 'Lunar Dance'
    },
    {
      id: 4,
      title: 'Electric Storm',
      artist: 'Midnight Pulse',
      releaseDate: '2025-05-10',
      genre: 'Electronic',
      description: 'High-energy electronic anthems perfect for late-night dance sessions.',
      image: 'https://images.pexels.com/photos/1652340/pexels-photo-1652340.jpeg?auto=compress&cs=tinysrgb&w=500',
      trackCount: 14,
      duration: '52:20',
      previewTrack: 'Thunder Strike'
    }
  ];

  const handlePresave = (album) => {
    if (!user) {
      alert('Please log in to presave albums');
      return;
    }

    if (presavedAlbums.includes(album.id)) {
      setPresavedAlbums(prev => prev.filter(id => id !== album.id));
    } else {
      setPresavedAlbums(prev => [...prev, album.id]);
    }
  };

  const isPresaved = (albumId) => presavedAlbums.includes(albumId);

  const formatReleaseDate = (dateString) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleDateString('en-US', { month: 'long' }),
      day: date.getDate(),
      year: date.getFullYear(),
      full: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
  };

  const getDaysUntilRelease = (dateString) => {
    const releaseDate = new Date(dateString);
    const today = new Date();
    const timeDiff = releaseDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  return (
    <div className="presave-page">
      <div className="container">
        <div className="presave-header">
          <h1 className="page-title">
            <Bell className="title-icon" />
            Presave Albums
          </h1>
        </div>

        <div className="presave-grid">
          {upcomingReleases.map(album => {
            const dateInfo = formatReleaseDate(album.releaseDate);
            const daysUntil = getDaysUntilRelease(album.releaseDate);
            const isReleased = daysUntil <= 0;

            return (
              <div key={album.id} className="presave-card">
                <div className="album-image">
                  <img src={album.image} alt={`${album.title} album cover`} />
                  <div className="release-countdown">
                    {isReleased ? (
                      <span className="released-badge">Released!</span>
                    ) : (
                      <span className="countdown-badge">
                        {daysUntil} day{daysUntil !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="album-overlay">
                    <button 
                      className={`presave-btn ${isPresaved(album.id) ? 'presaved' : ''}`}
                      onClick={() => handlePresave(album)}
                      disabled={isReleased}
                    >
                      <Heart size={16} fill={isPresaved(album.id) ? 'currentColor' : 'none'} />
                      {isReleased ? 'Available Now' : isPresaved(album.id) ? 'Presaved' : 'Presave'}
                    </button>
                  </div>
                </div>
                
                <div className="album-info">
                  <div className="album-artist">{album.artist}</div>
                  <h3 className="album-title">{album.title}</h3>
                  
                  <div className="album-details">
                    <div className="detail-row">
                      <Calendar size={16} />
                      <span>{dateInfo.full}</span>
                    </div>
                    <div className="detail-row">
                      <Music size={16} />
                      <span>{album.trackCount} tracks • {album.duration}</span>
                    </div>
                  </div>
                  
                  <div className="album-genre">{album.genre}</div>
                  <p className="album-description">{album.description}</p>
                  
                  <div className="preview-track">
                    <strong>Preview Track:</strong> "{album.previewTrack}"
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {presavedAlbums.length > 0 && (
          <div className="presaved-summary">
            <h3>Your Presaved Albums</h3>
            <p>
              You have {presavedAlbums.length} album{presavedAlbums.length !== 1 ? 's' : ''} presaved. 
              You'll be notified when {presavedAlbums.length !== 1 ? 'they become' : 'it becomes'} available!
            </p>
          </div>
        )}

        <div className="presave-benefits">
          <h2>Why Presave?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <Bell size={24} />
              <h4>First to Know</h4>
              <p>Get notified the moment new music drops</p>
            </div>
            <div className="benefit-card">
              <Music size={24} />
              <h4>Instant Access</h4>
              <p>Albums appear in your library automatically</p>
            </div>
            <div className="benefit-card">
              <Heart size={24} />
              <h4>Support Artists</h4>
              <p>Help your favorite artists with early engagement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presave;