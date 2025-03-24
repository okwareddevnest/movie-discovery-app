import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaMoon, FaSun, FaSearch, FaUser, FaSignOutAlt, FaBars, FaTimes, FaHeart, FaFilm } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { showToast } from './ToastContainer';

const Navbar = ({ isDarkMode, toggleDarkMode, openAuthModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  
  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      
      if (
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target) && 
        !event.target.closest('button[aria-label="Toggle mobile menu"]')
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput('');
      setSearchVisible(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
      showToast('success', 'Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
      showToast('error', 'Logout failed. Please try again.');
    }
  };
  
  const toggleMobileMenu = () => setIsOpen(!isOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  const toggleSearchBar = () => setSearchVisible(!searchVisible);
  
  return (
    <nav className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-white shadow-md dark:bg-gray-800' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="relative flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center text-2xl font-bold text-secondary"
            >
              <FaFilm className="mr-2" />
              <span className="hidden sm:inline">MovieVerse</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="hidden md:block">
                <div className="flex space-x-1">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive
                          ? 'text-secondary'
                          : 'text-gray-800 hover:text-secondary dark:text-gray-200'
                      }`
                    }
                  >
                    Home
                  </NavLink>
                  
                  <NavLink
                    to="/search"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive
                          ? 'text-secondary'
                          : 'text-gray-800 hover:text-secondary dark:text-gray-200'
                      }`
                    }
                  >
                    Discover
                  </NavLink>
                  
                  {user && (
                    <NavLink
                      to="/favorites"
                      className={({ isActive }) =>
                        `px-3 py-2 rounded-md text-base font-medium transition-colors ${
                          isActive
                            ? 'text-secondary'
                            : 'text-gray-800 hover:text-secondary dark:text-gray-200'
                        }`
                      }
                    >
                      Favorites
                    </NavLink>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Desktop & Mobile Right Section */}
          <div className="flex items-center">
            {/* Search toggle */}
            <button
              onClick={toggleSearchBar}
              className="rounded-full p-2 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle search"
            >
              <FaSearch />
            </button>
            
            {/* Theme toggle */}
            <button
              onClick={toggleDarkMode}
              className="ml-2 rounded-full p-2 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              aria-label={`Toggle ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
            
            {/* Authentication/User Menu */}
            {user ? (
              <div className="relative ml-3">
                <button
                  onClick={toggleUserMenu}
                  className="flex rounded-full text-sm focus:outline-none"
                  aria-label="Toggle user menu"
                >
                  <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-700">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || 'User'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-secondary text-white">
                        {user.name 
                          ? user.name[0].toUpperCase()
                          : <FaUser />
                        }
                      </div>
                    )}
                  </div>
                </button>
                
                {userMenuOpen && (
                  <div
                    ref={userMenuRef}
                    className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700"
                  >
                    <div className="border-b border-gray-100 px-4 py-2 dark:border-gray-700">
                      <p className="text-sm font-semibold">
                        {user.name || 'User'}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <FaUser className="mr-2" />
                      Profile
                    </Link>
                    
                    <Link
                      to="/favorites"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <FaHeart className="mr-2" />
                      Favorites
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="ml-3 hidden sm:block">
                <button
                  onClick={() => openAuthModal('login')}
                  className="rounded-full border border-secondary bg-transparent px-4 py-1 text-sm font-medium text-secondary hover:bg-secondary/5"
                >
                  Log in
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="ml-2 rounded-full bg-secondary px-4 py-1 text-sm font-medium text-white hover:bg-secondary/90"
                >
                  Sign up
                </button>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="ml-2 inline-flex items-center justify-center rounded-md p-2 text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 md:hidden"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            searchVisible ? 'max-h-14 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <form onSubmit={handleSubmit} className="border-t border-gray-200 py-2 dark:border-gray-700">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search for movies..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-md border-0 bg-gray-100 py-2 pl-10 pr-10 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-secondary dark:bg-gray-700 dark:text-white"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? 'max-h-64 border-t border-gray-200 dark:border-gray-700'
            : 'max-h-0'
        } overflow-hidden`}
      >
        <div className="space-y-1 px-2 pb-3 pt-2">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-base font-medium ${
                isActive
                  ? 'bg-gray-100 text-secondary dark:bg-gray-800'
                  : 'text-gray-900 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800'
              }`
            }
          >
            Home
          </NavLink>
          
          <NavLink
            to="/search"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2 text-base font-medium ${
                isActive
                  ? 'bg-gray-100 text-secondary dark:bg-gray-800'
                  : 'text-gray-900 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800'
              }`
            }
          >
            Discover
          </NavLink>
          
          {user ? (
            <>
              <NavLink
                to="/favorites"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-base font-medium ${
                    isActive
                      ? 'bg-gray-100 text-secondary dark:bg-gray-800'
                      : 'text-gray-900 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800'
                  }`
                }
              >
                Favorites
              </NavLink>
              
              <NavLink
                to="/profile"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-base font-medium ${
                    isActive
                      ? 'bg-gray-100 text-secondary dark:bg-gray-800'
                      : 'text-gray-900 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800'
                  }`
                }
              >
                Profile
              </NavLink>
              
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-red-600 hover:bg-gray-50 dark:text-red-400 dark:hover:bg-gray-800"
              >
                Sign out
              </button>
            </>
          ) : (
            <div className="mt-3 flex flex-col space-y-2 px-3">
              <button
                onClick={() => {
                  openAuthModal('login');
                  setIsOpen(false);
                }}
                className="rounded-md bg-transparent border border-secondary px-4 py-2 text-center font-medium text-secondary"
              >
                Log in
              </button>
              
              <button
                onClick={() => {
                  openAuthModal('signup');
                  setIsOpen(false);
                }}
                className="rounded-md bg-secondary px-4 py-2 text-center font-medium text-white hover:bg-secondary/90"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 