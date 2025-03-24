import api from './api';
import toast from 'react-hot-toast';

// Add a movie to favorites
export const addToFavorites = async (movieData) => {
  try {
    const { data } = await api.post('/api/favorites', movieData);
    toast.success('Added to favorites');
    return data;
  } catch (error) {
    const message = error.response?.data?.error || 'Failed to add to favorites';
    toast.error(message);
    throw error;
  }
};

// Get user's favorites
export const getFavorites = async () => {
  try {
    const { data } = await api.get('/api/favorites');
    return data;
  } catch (error) {
    const message = error.response?.data?.error || 'Failed to fetch favorites';
    toast.error(message);
    throw error;
  }
};

// Remove a movie from favorites
export const removeFromFavorites = async (movieId) => {
  try {
    await api.delete(`/api/favorites/${movieId}`);
    toast.success('Removed from favorites');
    return true;
  } catch (error) {
    const message = error.response?.data?.error || 'Failed to remove from favorites';
    toast.error(message);
    throw error;
  }
}; 