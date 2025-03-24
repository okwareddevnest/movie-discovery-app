import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaGithub, FaLinkedin, FaInstagram, FaFilm, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 pt-12 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Footer main content */}
        <div className="grid grid-cols-1 gap-8 pb-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About section */}
          <div>
            <div className="mb-4 flex items-center">
              <FaFilm className="mr-2 text-secondary" />
              <h2 className="text-2xl font-bold text-secondary">MovieVerse</h2>
            </div>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Discover the latest movies, create your watchlist, and share your thoughts with the MovieVerse community.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 transition-colors hover:text-secondary dark:text-gray-400"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 transition-colors hover:text-secondary dark:text-gray-400"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 transition-colors hover:text-secondary dark:text-gray-400"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 transition-colors hover:text-secondary dark:text-gray-400"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 transition-colors hover:text-secondary dark:text-gray-300 dark:hover:text-secondary"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="text-gray-600 transition-colors hover:text-secondary dark:text-gray-300 dark:hover:text-secondary"
                >
                  Discover
                </Link>
              </li>
              <li>
                <Link
                  to="/favorites"
                  className="text-gray-600 transition-colors hover:text-secondary dark:text-gray-300 dark:hover:text-secondary"
                >
                  Favorites
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-600 transition-colors hover:text-secondary dark:text-gray-300 dark:hover:text-secondary"
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/search?genre=action"
                  className="text-gray-600 transition-colors hover:text-secondary dark:text-gray-300 dark:hover:text-secondary"
                >
                  Action
                </Link>
              </li>
              <li>
                <Link
                  to="/search?genre=comedy"
                  className="text-gray-600 transition-colors hover:text-secondary dark:text-gray-300 dark:hover:text-secondary"
                >
                  Comedy
                </Link>
              </li>
              <li>
                <Link
                  to="/search?genre=drama"
                  className="text-gray-600 transition-colors hover:text-secondary dark:text-gray-300 dark:hover:text-secondary"
                >
                  Drama
                </Link>
              </li>
              <li>
                <Link
                  to="/search?genre=thriller"
                  className="text-gray-600 transition-colors hover:text-secondary dark:text-gray-300 dark:hover:text-secondary"
                >
                  Thriller
                </Link>
              </li>
              <li>
                <Link
                  to="/search?genre=sci-fi"
                  className="text-gray-600 transition-colors hover:text-secondary dark:text-gray-300 dark:hover:text-secondary"
                >
                  Sci-Fi
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/terms"
                  className="text-gray-600 transition-colors hover:text-secondary dark:text-gray-300 dark:hover:text-secondary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-600 transition-colors hover:text-secondary dark:text-gray-300 dark:hover:text-secondary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/cookie-policy"
                  className="text-gray-600 transition-colors hover:text-secondary dark:text-gray-300 dark:hover:text-secondary"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <a
                  href="https://www.themoviedb.org/documentation/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 transition-colors hover:text-secondary dark:text-gray-300 dark:hover:text-secondary"
                >
                  TMDB API
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Divider */}
        <div className="my-4 h-px w-full bg-gray-200 dark:bg-gray-700"></div>
        
        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          <p className="text-gray-600 dark:text-gray-300">
            © {currentYear} MovieVerse. All rights reserved.
          </p>
          <p className="flex items-center text-gray-600 dark:text-gray-300">
            Made with <FaHeart className="mx-1 text-red-500" /> by MovieVerse Team
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Powered by <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-secondary">TMDB</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 