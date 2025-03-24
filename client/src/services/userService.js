import api from './api';
import toast from 'react-hot-toast';

/**
 * Get user reviews
 * @param {string} userId - The user ID (optional, defaults to current user)
 * @returns {Promise<Array>} - The user's reviews
 */
export const getUserReviews = async (userId = null) => {
  try {
    const endpoint = userId ? `/api/reviews/user/${userId}` : '/api/reviews/user/me';
    const { data } = await api.get(endpoint);
    return data;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return [];
  }
};

/**
 * Update user profile
 * @param {string} userId - The user ID
 * @param {Object} profileData - The profile data to update
 * @param {File} photoFile - Optional profile photo file to upload
 * @returns {Promise<Object>} - The updated user data
 */
export const updateUserProfile = async (userId, profileData, photoFile = null) => {
  try {
    let photoURL = profileData.photoURL;
    
    // If a new photo was uploaded, process it
    if (photoFile) {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('photo', photoFile);
      
      // Upload the photo
      const uploadResponse = await api.post('/api/users/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      photoURL = uploadResponse.data.photoURL;
    }
    
    // Update user profile in MongoDB
    const { data } = await api.put(`/api/users/${userId}`, {
      displayName: profileData.displayName,
      photoURL: photoURL
    });
    
    return data;
  } catch (error) {
    const message = error.response?.data?.error || 'Failed to update profile';
    toast.error(message);
    throw error;
  }
};

/**
 * Get user data
 * @param {string} userId - The user ID (optional, defaults to current user)
 * @returns {Promise<Object>} - The user data
 */
export const getUserData = async (userId = null) => {
  try {
    const endpoint = userId ? `/api/users/${userId}` : '/api/users/me';
    const { data } = await api.get(endpoint);
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}; 