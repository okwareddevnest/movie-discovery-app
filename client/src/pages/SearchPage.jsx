import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../services/tmdbApi';
import { getFavorites } from '../services/favoriteService';
import { useAuth } from '../context/AuthContext';
import MovieGrid from '../components/MovieGrid';
import Loader from '../components/Loader';
import { FaSearch } from 'react-icons/fa';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(query);
  
  const { isAuthenticated } = useAuth();

  // Search movies when query or page changes
  useEffect(() => {
    const fetchMovies = async () => {
      if (!query) {
        setMovies([]);
        setTotalPages(0);
        return;
      }
      
      try {
        setLoading(true);
        const data = await searchMovies(query, currentPage);
        setMovies(data.results);
        setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
      } catch (error) {
        console.error('Error searching movies:', error);
        setError('Failed to search movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query, currentPage]);

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

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
      setCurrentPage(1);
    }
  };

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
        return prevFavorites.filter(fav => fav.movieId !== movieIdStr);
      } else {
        return prevFavorites;
      }
    });
  };

  return (
    <div>
      {/* Search form */}
      <div className="mx-auto mb-8 max-w-2xl">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search for movies..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-3 pl-4 pr-10 shadow-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-secondary dark:text-gray-400"
            >
              <FaSearch />
            </button>
          </div>
          <button
            type="submit"
            className="rounded-md bg-secondary px-4 py-3 font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
          >
            Search
          </button>
        </form>
      </div>

      {/* Search results */}
      {loading ? (
        <Loader size="large" />
      ) : error ? (
        <div className="flex h-40 items-center justify-center text-red-500">
          <p>{error}</p>
        </div>
      ) : !query ? (
        <div className="flex h-40 items-center justify-center text-lg text-gray-500">
          Enter a search term to find movies
        </div>
      ) : (
        <MovieGrid
          movies={movies}
          title={`Search Results for "${query}"`}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          favorites={favorites}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}
    </div>
  );
};

export default SearchPage; 