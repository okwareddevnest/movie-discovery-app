import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_API_URL = import.meta.env.VITE_TMDB_API_URL;
const TMDB_IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_URL;

// Create axios instance for TMDB API
const tmdbApi = axios.create({
  baseURL: TMDB_API_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

// Common parameters for all requests
const defaultParams = {
  language: 'en-US',
  include_adult: false,
};

// Image URL builder
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${TMDB_IMAGE_URL}/${size}${path}`;
};

// API functions
export const getTrending = async (page = 1) => {
  try {
    const { data } = await tmdbApi.get('/trending/movie/week', {
      params: {
        ...defaultParams,
        page,
      },
    });
    return data;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const { data } = await tmdbApi.get('/search/movie', {
      params: {
        ...defaultParams,
        query,
        page,
      },
    });
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (id) => {
  try {
    const { data } = await tmdbApi.get(`/movie/${id}`, {
      params: {
        ...defaultParams,
        append_to_response: 'videos,credits,similar',
      },
    });
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const getMovieVideos = async (id) => {
  try {
    const { data } = await tmdbApi.get(`/movie/${id}/videos`, {
      params: defaultParams,
    });
    return data.results;
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    throw error;
  }
};

export const getMovieCredits = async (id) => {
  try {
    const { data } = await tmdbApi.get(`/movie/${id}/credits`, {
      params: defaultParams,
    });
    return data;
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    throw error;
  }
};

export const getSimilarMovies = async (id, page = 1) => {
  try {
    const { data } = await tmdbApi.get(`/movie/${id}/similar`, {
      params: {
        ...defaultParams,
        page,
      },
    });
    return data;
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    throw error;
  }
}; 