import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaImage } from 'react-icons/fa';
import { getFavorites, removeFromFavorites } from '../services/favoriteService';
import { getImageUrl } from '../services/tmdbApi';
import Loader from '../components/Loader';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use a fallback for missing images
  const renderPoster = (favorite) => {
    if (favorite.poster) {
      return (
        <img
          src={getImageUrl(favorite.poster)}
          alt={`${favorite.title} poster`}
          className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            e.target.parentNode.classList.add('flex', 'items-center', 'justify-center', 'bg-gray-200');
            const fallback = document.createElement('div');
            fallback.innerHTML = `<div class="flex flex-col items-center justify-center">
              <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" clipRule="evenodd" />
              </svg>
              <p class="mt-2 text-sm text-gray-500">No image available</p>
            </div>`;
            e.target.parentNode.appendChild(fallback.firstChild);
          }}
        />
      );
    } else {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-200">
          <FaImage className="h-16 w-16 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">No image available</p>
        </div>
      );
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const data = await getFavorites();
        setFavorites(data);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setError('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (movieId) => {
    try {
      await removeFromFavorites(movieId);
      setFavorites(favorites.filter(fav => fav.movieId !== movieId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return <Loader size="large" />;
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="py-10 text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
          <FaHeart className="h-10 w-10 text-gray-400" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold">No favorites yet</h2>
        <p className="mb-6 mt-2 text-gray-600 dark:text-gray-400">
          Start exploring and add some movies to your favorites
        </p>
        <Link
          to="/"
          className="inline-flex items-center rounded-md bg-secondary px-4 py-2 text-white hover:bg-opacity-90"
        >
          Explore Movies
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">My Favorites</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {favorites.map((favorite) => (
          <div key={favorite._id} className="card group relative">
            {/* Remove button */}
            <button
              onClick={() => handleRemoveFavorite(favorite.movieId)}
              className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              aria-label="Remove from favorites"
            >
              <FaTrash className="text-red-500" />
            </button>

            {/* Movie link */}
            <Link to={`/movie/${favorite.movieId}`}>
              {/* Poster */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-200">
                {renderPoster(favorite)}
              </div>

              {/* Movie info */}
              <div className="p-4">
                <h3 className="mb-1 text-lg font-medium line-clamp-1">{favorite.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    {favorite.releaseDate
                      ? new Date(favorite.releaseDate).getFullYear()
                      : 'N/A'}
                  </span>
                  {favorite.rating && (
                    <div className="flex items-center">
                      <FaHeart className="mr-1 text-red-500" />
                      <span>{favorite.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2 dark:text-gray-400">
                  {favorite.overview}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites; 