# Movie Discovery Web Application

A full-stack web application for discovering movies, managing favorites, and sharing reviews.

## Features

- **Movie Discovery**: Browse trending movies and search for movies by title
- **Movie Details**: View detailed information about movies, including synopsis, cast, trailer, and reviews
- **User Accounts**: Register and login to access personalized features
- **Favorites**: Save and manage your favorite movies
- **Reviews**: Read and write reviews for movies
- **User Profiles**: Manage your profile, view your activity, and update your settings
- **Responsive Design**: Optimized for mobile, tablet, and desktop screens
- **Dark Mode**: Toggle between light and dark themes

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Tailwind CSS for styling
- Vite for build tooling

### Backend
- Node.js
- Express.js
- MongoDB for database
- JSON Web Tokens for authentication

## Installation and Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (local or Atlas)

### Clone the repository
```bash
git clone https://github.com/okwareddevnest/movie-discovery-app.git
cd movie-discovery-app
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

### Backend Setup
```bash
cd server
npm install
npm run dev
```

### Environment Variables

#### Frontend (.env in client directory)
```
VITE_API_URL=http://localhost:5000/api
VITE_TMDB_API_KEY=your_tmdb_api_key
```

#### Backend (.env in server directory)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## API Reference

The application uses two main APIs:
1. TMDB API for movie data
2. Custom backend API for user management, favorites, and reviews

### Backend API Endpoints

- **Auth**: `/api/users/register`, `/api/users/login`
- **Users**: `/api/users/profile`, `/api/users/update`
- **Favorites**: `/api/favorites`, `/api/favorites/:id`
- **Reviews**: `/api/reviews`, `/api/reviews/:movieId`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. 