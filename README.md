# Pacific Records

A modern music platform for discovering emerging artists and managing music-related services.

## Features

- **Artist Discovery**: Browse and discover new artists
- **Music Store**: Shop for vinyl records and merchandise
- **Tour Management**: Find and book shows
- **User Authentication**: Secure login and registration
- **Admin Dashboard**: Comprehensive admin panel for managing artists, users, and orders

## Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Lucide React Icons
- CSS3

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/kkritagya/pacific.git
cd pacific
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
```

4. Set up environment variables
```bash
# Create .env file in backend directory
cp .env.example .env
# Edit .env with your database credentials
```

5. Start the development servers
```bash
# Frontend (from root directory)
npm run dev

# Backend (from backend directory)
npm start
```

## Project Structure

```
pacific/
├── src/                    # Frontend source code
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── context/           # React context providers
│   └── assets/            # Static assets
├── backend/               # Backend server
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── middleware/       # Custom middleware
└── public/               # Public assets
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
