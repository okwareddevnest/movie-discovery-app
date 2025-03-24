import api from './api';
import toast from 'react-hot-toast';

// Add a review
export const addReview = async (reviewData) => {
  try {
    const { data } = await api.post('/api/reviews', reviewData);
    toast.success('Review added successfully');
    return data;
  } catch (error) {
    const message = error.response?.data?.error || 'Failed to add review';
    toast.error(message);
    throw error;
  }
};

// Get movie reviews
export const getMovieReviews = async (movieId) => {
  try {
    const { data } = await api.get(`/api/reviews/${movieId}`);
    return data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

// Get user's reviews
export const getUserReviews = async () => {
  try {
    const { data } = await api.get('/api/reviews/user/me');
    return data;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  try {
    await api.delete(`/api/reviews/${reviewId}`);
    toast.success('Review deleted successfully');
    return true;
  } catch (error) {
    const message = error.response?.data?.error || 'Failed to delete review';
    toast.error(message);
    throw error;
  }
}; 