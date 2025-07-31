import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Users, Calendar } from 'lucide-react';
import './Artists.css';

const Artists = () => {
  const artists = [
    // Rap
    {
      id: 1,
      name: 'Drake',
      genre: 'Rap',
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Drake is a Canadian rapper, singer, and songwriter known for his chart-topping hits and genre-blending style.',
      monthlyListeners: '60M',
      upcomingShows: 12,
      albums: 7
    },
    {
      id: 2,
      name: 'J. Cole',
      genre: 'Rap',
      image: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'J. Cole is an American rapper and producer celebrated for his introspective lyrics and chart-topping albums.',
      monthlyListeners: '20M',
      upcomingShows: 8,
      albums: 6
    },
    {
      id: 15,
      name: 'Nicki Minaj',
      genre: 'Rap',
      image: 'https://images.pexels.com/photos/1679825/pexels-photo-1679825.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Nicki Minaj is a Trinidadian-American rapper, singer, and songwriter known for her dynamic flow and colorful persona.',
      monthlyListeners: '30M',
      upcomingShows: 9,
      albums: 5
    },
    {
      id: 16,
      name: 'Travis Scott',
      genre: 'Rap',
      image: 'https://images.pexels.com/photos/1679642/pexels-photo-1679642.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Travis Scott is an American rapper and producer known for his energetic performances and genre-blending music.',
      monthlyListeners: '40M',
      upcomingShows: 14,
      albums: 4
    },
    // Indie Rock
    {
      id: 3,
      name: 'Arctic Monkeys',
      genre: 'Indie Rock',
      image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Arctic Monkeys are an English indie rock band known for their sharp lyrics and energetic performances.',
      monthlyListeners: '20M',
      upcomingShows: 12,
      albums: 6
    },
    {
      id: 4,
      name: 'Tame Impala',
      genre: 'Indie Rock',
      image: 'https://images.pexels.com/photos/167964/pexels-photo-167964.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Tame Impala is the psychedelic music project of Australian multi-instrumentalist Kevin Parker.',
      monthlyListeners: '15M',
      upcomingShows: 9,
      albums: 4
    },
    {
      id: 17,
      name: 'Vampire Weekend',
      genre: 'Indie Rock',
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Vampire Weekend is an American indie rock band known for their eclectic sound and witty lyrics.',
      monthlyListeners: '7M',
      upcomingShows: 7,
      albums: 4
    },
    {
      id: 18,
      name: 'The Strokes',
      genre: 'Indie Rock',
      image: 'https://images.pexels.com/photos/1370545/pexels-photo-1370545.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'The Strokes are a New York City rock band credited with helping revive garage rock in the early 2000s.',
      monthlyListeners: '10M',
      upcomingShows: 10,
      albums: 6
    },
    // Pop
    {
      id: 5,
      name: 'Taylor Swift',
      genre: 'Pop',
      image: 'https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Taylor Swift is an American singer-songwriter known for her narrative songwriting and global pop hits.',
      monthlyListeners: '80M',
      upcomingShows: 20,
      albums: 10
    },
    {
      id: 6,
      name: 'Dua Lipa',
      genre: 'Pop',
      image: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Dua Lipa is a British pop star recognized for her dance-pop anthems and powerful vocals.',
      monthlyListeners: '65M',
      upcomingShows: 15,
      albums: 2
    },
    {
      id: 19,
      name: 'Ariana Grande',
      genre: 'Pop',
      image: 'https://images.pexels.com/photos/167964/pexels-photo-167964.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Ariana Grande is an American pop and R&B singer known for her wide vocal range and chart-topping singles.',
      monthlyListeners: '70M',
      upcomingShows: 18,
      albums: 6
    },
    {
      id: 20,
      name: 'Ed Sheeran',
      genre: 'Pop',
      image: 'https://images.pexels.com/photos/1679642/pexels-photo-1679642.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Ed Sheeran is a British singer-songwriter known for his melodic pop songs and heartfelt lyrics.',
      monthlyListeners: '75M',
      upcomingShows: 22,
      albums: 5
    },
    // Electronic
    {
      id: 7,
      name: 'ODESZA',
      genre: 'Electronic',
      image: 'https://images.pexels.com/photos/1652340/pexels-photo-1652340.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'ODESZA is an American electronic music duo celebrated for their cinematic, uplifting tracks.',
      monthlyListeners: '7M',
      upcomingShows: 15,
      albums: 4
    },
    {
      id: 8,
      name: 'Flume',
      genre: 'Electronic',
      image: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Flume is an Australian electronic music producer known for his innovative, genre-blending sound.',
      monthlyListeners: '10M',
      upcomingShows: 11,
      albums: 3
    },
    {
      id: 21,
      name: 'Calvin Harris',
      genre: 'Electronic',
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Calvin Harris is a Scottish DJ and producer known for his chart-topping electronic dance music hits.',
      monthlyListeners: '50M',
      upcomingShows: 16,
      albums: 5
    },
    {
      id: 22,
      name: 'Deadmau5',
      genre: 'Electronic',
      image: 'https://images.pexels.com/photos/1370545/pexels-photo-1370545.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Deadmau5 is a Canadian electronic music producer and DJ known for his progressive house tracks and live shows.',
      monthlyListeners: '8M',
      upcomingShows: 12,
      albums: 8
    },
    // Alternative Rock
    {
      id: 9,
      name: 'Radiohead',
      genre: 'Alternative Rock',
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Radiohead is an English rock band acclaimed for their experimental approach and influential albums.',
      monthlyListeners: '12M',
      upcomingShows: 10,
      albums: 9
    },
    {
      id: 10,
      name: 'Foo Fighters',
      genre: 'Alternative Rock',
      image: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Foo Fighters are an American rock band known for their energetic live shows and anthemic songs.',
      monthlyListeners: '13M',
      upcomingShows: 7,
      albums: 10
    },
    {
      id: 23,
      name: 'Muse',
      genre: 'Alternative Rock',
      image: 'https://images.pexels.com/photos/1679825/pexels-photo-1679825.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Muse is a British rock band known for their fusion of alternative, progressive, and electronic music.',
      monthlyListeners: '9M',
      upcomingShows: 13,
      albums: 8
    },
    {
      id: 24,
      name: 'The Killers',
      genre: 'Alternative Rock',
      image: 'https://images.pexels.com/photos/1679642/pexels-photo-1679642.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'The Killers are an American rock band known for their anthemic sound and energetic performances.',
      monthlyListeners: '11M',
      upcomingShows: 11,
      albums: 6
    },
    // Ambient
    {
      id: 11,
      name: 'Brian Eno',
      genre: 'Ambient',
      image: 'https://images.pexels.com/photos/1370545/pexels-photo-1370545.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Brian Eno is a pioneering English musician and composer, widely regarded as the father of ambient music.',
      monthlyListeners: '1M',
      upcomingShows: 2,
      albums: 20
    },
    {
      id: 12,
      name: 'Hammock',
      genre: 'Ambient',
      image: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Hammock is an American post-rock and ambient band known for their lush, cinematic soundscapes.',
      monthlyListeners: '500K',
      upcomingShows: 1,
      albums: 10
    },
    {
      id: 25,
      name: 'Moby',
      genre: 'Ambient',
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Moby is an American musician and producer known for his ambient and electronic music.',
      monthlyListeners: '2M',
      upcomingShows: 3,
      albums: 15
    },
    {
      id: 26,
      name: 'Tycho',
      genre: 'Ambient',
      image: 'https://images.pexels.com/photos/167964/pexels-photo-167964.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Tycho is an American musician, composer, and producer known for his downtempo and ambient soundscapes.',
      monthlyListeners: '1.5M',
      upcomingShows: 5,
      albums: 6
    },
    // Jazz
    {
      id: 13,
      name: 'Miles Davis',
      genre: 'Jazz',
      image: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Miles Davis was an American jazz trumpeter, bandleader, and composer, a major influence in jazz history.',
      monthlyListeners: '2M',
      upcomingShows: 0,
      albums: 50
    },
    {
      id: 14,
      name: 'John Coltrane',
      genre: 'Jazz',
      image: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'John Coltrane was an American jazz saxophonist and composer, renowned for his pioneering work in jazz.',
      monthlyListeners: '1.5M',
      upcomingShows: 0,
      albums: 45
    },
    {
      id: 27,
      name: 'Herbie Hancock',
      genre: 'Jazz',
      image: 'https://images.pexels.com/photos/1679825/pexels-photo-1679825.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Herbie Hancock is an American jazz pianist, keyboardist, and composer, a key figure in modern jazz.',
      monthlyListeners: '1M',
      upcomingShows: 2,
      albums: 40
    },
    {
      id: 28,
      name: 'Norah Jones',
      genre: 'Jazz',
      image: 'https://images.pexels.com/photos/1679642/pexels-photo-1679642.jpeg?auto=compress&cs=tinysrgb&w=500',
      bio: 'Norah Jones is an American singer, songwriter, and pianist known for her jazz-influenced pop music.',
      monthlyListeners: '3M',
      upcomingShows: 6,
      albums: 7
    }
  ];

  const genres = ['All', 'Rap', 'Indie Rock', 'Pop', 'Electronic', 'Alternative Rock', 'Ambient', 'Jazz'];
  const [selectedGenre, setSelectedGenre] = React.useState('All');

  const filteredArtists = selectedGenre === 'All' 
    ? artists 
    : artists.filter(artist => artist.genre === selectedGenre);

  return (
    <div className="artists-page">
      <div className="container">
        <div className="artists-header">
          <h1 className="page-title">Our Artists</h1>
        </div>

        <div className="genre-filter">
          {genres.map(genre => (
            <button
              key={genre}
              className={`filter-btn ${selectedGenre === genre ? 'filter-btn-active' : ''}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="artists-grid">
          {filteredArtists.map(artist => (
            <div key={artist.id} className="artist-card">
              <div className="artist-image">
                <img src={artist.image} alt={artist.name} />
                <div className="artist-overlay">
                  <Link to={`/artists/${artist.id}`} className="btn btn-primary">
                    View Profile
                  </Link>
                </div>
              </div>
              <div className="artist-content">
                <div className="artist-header">
                  <h3 className="artist-name">{artist.name}</h3>
                  <p className="artist-genre">{artist.genre}</p>
                </div>
                <p className="artist-bio">{artist.bio}</p>
                <div className="artist-stats">
                  <div className="stat">
                    <Users className="stat-icon" />
                    <span>{artist.monthlyListeners}</span>
                  </div>
                  <div className="stat">
                    <Calendar className="stat-icon" />
                    <span>{artist.upcomingShows} Shows</span>
                  </div>
                  <div className="stat">
                    <Play className="stat-icon" />
                    <span>{artist.albums} Albums</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Artists;