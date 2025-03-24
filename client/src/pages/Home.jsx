import { useState, useEffect } from 'react';
import { getTrending } from '../services/tmdbApi';
import { getFavorites } from '../services/favoriteService';
import { useAuth } from '../context/AuthContext';
import TrendingSlider from '../components/TrendingSlider';
import MovieGrid from '../components/MovieGrid';
import Loader from '../components/Loader';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Fetch trending movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await getTrending(currentPage);
        setTrendingMovies(data.results);
        setTotalPages(data.total_pages > 500 ? 500 : data.total_pages); // TMDB API limits to 500 pages
      } catch (error) {
        console.error('Error fetching trending movies:', error);
        setError('Failed to load trending movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage]);

  // Fetch favorites if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchFavorites = async () => {
        try {
          const data = await getFavorites();
          setFavorites(data);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      };

      fetchFavorites();
    }
  }, [isAuthenticated]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (movieId) => {
    setFavorites(prevFavorites => {
      const movieIdStr = movieId.toString();
      const exists = prevFavorites.some(fav => fav.movieId === movieIdStr);
      
      if (exists) {
        // Remove from favorites
        return prevFavorites.filter(fav => fav.movieId !== movieIdStr);
      } else {
        // Add to favorites (will be updated on next favorites fetch)
        return prevFavorites;
      }
    });
  };

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Slider */}
      <section className="mb-12">
        <TrendingSlider />
      </section>

      {/* Trending Movies Grid */}
      <section>
        {loading ? (
          <Loader size="large" />
        ) : (
          <MovieGrid
            movies={trendingMovies}
            title="Trending Movies"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            favorites={favorites}
            onFavoriteToggle={handleFavoriteToggle}
          />
        )}
      </section>
    </div>
  );
};

export default Home; 