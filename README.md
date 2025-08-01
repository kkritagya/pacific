# Pacific - Music Platform

A comprehensive music platform built with React and Node.js, featuring artist management, merchandise sales, vinyl records, tour information, and e-commerce functionality.

## Features

### Frontend (React + Vite)
- **User Authentication**: Login, registration, and profile management
- **Artist Pages**: Browse artists and view detailed profiles with discography
- **E-commerce**: Shop for merchandise and vinyl records
- **Tour Information**: View upcoming tours and events
- **Presave System**: Pre-order upcoming releases
- **Shopping Cart**: Full e-commerce cart functionality
- **Admin Panel**: Complete administrative interface for managing users, artists, and orders

### Backend (Node.js + Express)
- **RESTful API**: Complete backend API for all frontend functionality
- **Database Models**: User, Artist, Product, Cart, Order management
- **Authentication**: JWT-based authentication system
- **Admin Controls**: Administrative functions for platform management

## Tech Stack

### Frontend
- React 18
- Vite
- CSS3
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT Authentication

## Project Structure

```
pacific/
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── context/           # React context providers
│   ├── pages/             # Page components
│   │   └── admin/         # Admin panel pages
│   └── assets/            # Static assets
├── backend/               # Node.js backend
│   ├── Controller/        # API controllers
│   ├── model/            # Database models
│   ├── route/            # API routes
│   ├── middleware/       # Custom middleware
│   └── Database/         # Database configuration
└── public/               # Public static files
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB

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
cp backend/.env.example backend/.env
# Edit with your configuration
```

5. Start the development servers

Frontend:
```bash
npm run dev
```

Backend:
```bash
cd backend
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Artists
- `GET /api/artists` - Get all artists
- `GET /api/artists/:id` - Get artist details
- `POST /api/artists` - Create artist (admin)
- `PUT /api/artists/:id` - Update artist (admin)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)

### Cart & Orders
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
