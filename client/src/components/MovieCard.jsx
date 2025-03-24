import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart, FaCalendarAlt, FaPlayCircle, FaImage } from 'react-icons/fa';
import { getImageUrl } from '../services/tmdbApi';
import { useAuth } from '../context/AuthContext';
import { addToFavorites, removeFromFavorites } from '../services/favoriteService';
import { showToast } from './ToastContainer';

const MovieCard = ({ movie, isFavorite, onFavoriteToggle }) => {
  const { isAuthenticated } = useAuth();
  const {
    id,
    title,
    poster_path,
    vote_average,
    release_date,
  } = movie;

  const releaseYear = release_date ? new Date(release_date).getFullYear() : 'N/A';
  const rating = vote_average ? vote_average.toFixed(1) : 'N/A';

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Please login to add favorites', 'info');
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(id);
        showToast(`Removed "${title}" from favorites`, 'success');
      } else {
        await addToFavorites({
          movieId: id.toString(),
          title,
          poster: poster_path,
          overview: movie.overview,
          rating: vote_average,
          releaseDate: release_date
        });
        showToast(`Added "${title}" to favorites`, 'success');
      }
      
      if (onFavoriteToggle) {
        onFavoriteToggle(id);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      showToast('Failed to update favorites', 'error');
    }
  };

  return (
    <Link 
      to={`/movie/${id}`} 
      className="group relative block h-full overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:bg-gray-800"
    >
      {/* Favorite button */}
      <button
        onClick={handleFavoriteClick}
        className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-lg text-white opacity-90 transition-all hover:bg-black/80 hover:text-primary group-hover:opacity-100"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? (
          <FaHeart className="text-red-500" />
        ) : (
          <FaRegHeart />
        )}
      </button>

      {/* Poster */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-200">
        {poster_path ? (
          <img
            src={getImageUrl(poster_path)}
            alt={`${title} poster`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              const placeholder = document.createElement('div');
              placeholder.className = 'flex h-full w-full flex-col items-center justify-center';
              placeholder.innerHTML = `
                <FaImage className="h-16 w-16 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">No image available</p>
              `;
              e.target.parentNode.appendChild(placeholder);
            }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <FaImage className="h-16 w-16 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No image available</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-0 left-0 p-4">
            <div className="flex items-center gap-1 text-white">
              <FaPlayCircle className="text-secondary" />
              <span className="text-sm font-medium">View Details</span>
            </div>
          </div>
        </div>
      </div>

      {/* Movie info */}
      <div className="p-4">
        <h3 className="mb-2 text-lg font-bold line-clamp-1">{title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-1" />
            <span>{releaseYear}</span>
          </div>
          <div className="flex items-center">
            <FaStar className="mr-1 text-yellow-500" />
            <span>{rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard; 