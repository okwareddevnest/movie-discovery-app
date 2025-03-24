import React, { useState } from 'react';
import { FaList, FaThLarge } from 'react-icons/fa';
import MovieCard from './MovieCard';
import Pagination from './Pagination';

const MovieGrid = ({ 
  movies, 
  title,
  currentPage, 
  totalPages, 
  onPageChange,
  favorites = [],
  onFavoriteToggle 
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  return (
    <div className="my-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
        
        {/* View toggle */}
        <button 
          onClick={toggleViewMode}
          className="flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {viewMode === 'grid' ? (
            <>
              <FaList className="mr-2" />
              List View
            </>
          ) : (
            <>
              <FaThLarge className="mr-2" />
              Grid View
            </>
          )}
        </button>
      </div>

      {movies.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-lg text-gray-500">
          No movies found
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
            : 'grid-cols-1'
        }`}>
          {movies.map((movie) => {
            // Check if movie is in favorites
            const isFavorite = favorites.some(
              fav => fav.movieId === movie.id.toString()
            );
            
            return (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                isFavorite={isFavorite}
                onFavoriteToggle={onFavoriteToggle}
              />
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default MovieGrid; 