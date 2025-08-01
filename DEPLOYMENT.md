# Deployment Guide

This guide explains how to deploy the Pacific music platform to production.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Git
- A hosting platform (Heroku, Vercel, AWS, etc.)

## Frontend Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy from the project root:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `REACT_APP_API_URL`: Your backend API URL

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variables in Netlify dashboard

## Backend Deployment

### Heroku

1. Install Heroku CLI
2. Create a new Heroku app:
```bash
heroku create your-app-name
```

3. Add MongoDB addon:
```bash
heroku addons:create mongolab
```

4. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_key
```

5. Deploy:
```bash
git push heroku master
```

### Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.com
```

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=production
```

## Database Setup

1. Create a MongoDB database (MongoDB Atlas recommended)
2. Get your connection string
3. Update the `MONGODB_URI` environment variable

## SSL/HTTPS

- Use a reverse proxy (Nginx) for SSL termination
- Or use hosting platform's built-in SSL
- Ensure all API calls use HTTPS

## Monitoring

- Set up logging (Winston recommended)
- Monitor application performance
- Set up error tracking (Sentry)

## Backup Strategy

- Regular database backups
- Code repository backups
- Environment variable backups

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure CORS_ORIGIN is set correctly
2. **Database connection**: Check MongoDB connection string
3. **JWT errors**: Verify JWT_SECRET is set
4. **Build failures**: Check Node.js version compatibility 