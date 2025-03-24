import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaSadTear } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center md:p-8">
      <div className="mb-8 text-9xl font-bold text-secondary opacity-20">404</div>
      
      <FaSadTear className="mb-6 text-6xl text-gray-400" />
      
      <h1 className="mb-4 text-3xl font-bold text-gray-800 dark:text-white md:text-4xl">
        Page Not Found
      </h1>
      
      <p className="mb-8 max-w-md text-lg text-gray-600 dark:text-gray-400">
        Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Link
          to="/"
          className="flex items-center justify-center rounded-lg bg-secondary px-6 py-3 font-semibold text-white transition-all hover:bg-secondary/80"
        >
          <FaHome className="mr-2" />
          Back to Home
        </Link>
        
        <Link
          to="/search"
          className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        >
          <FaSearch className="mr-2" />
          Search Movies
        </Link>
      </div>
      
      <div className="mt-12 w-full max-w-lg rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
          Popular Destinations
        </h2>
        
        <ul className="space-y-2">
          <li>
            <Link 
              to="/" 
              className="block rounded-md p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Home - Discover trending movies
            </Link>
          </li>
          <li>
            <Link 
              to="/search" 
              className="block rounded-md p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Search - Find specific movies
            </Link>
          </li>
          <li>
            <Link 
              to="/favorites" 
              className="block rounded-md p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Favorites - Your saved movies
            </Link>
          </li>
          <li>
            <Link 
              to="/profile" 
              className="block rounded-md p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Profile - Your account settings
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NotFound; 