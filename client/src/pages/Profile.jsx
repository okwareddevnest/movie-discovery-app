import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEdit, FaEnvelope, FaCalendarAlt, FaFilm, FaStar, FaSignOutAlt, FaCamera } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getFavorites } from '../services/favoriteService';
import { getUserReviews, updateUserProfile, getUserData } from '../services/userService';
import { getImageUrl } from '../services/tmdbApi';
import Loader from '../components/Loader';
import MovieCard from '../components/MovieCard';
import { showToast } from '../components/ToastContainer';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    displayName: user?.name || '',
    photoURL: user?.avatar || '',
  });
  const [fileUpload, setFileUpload] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      setLoading(true);
      try {
        // Fetch favorites
        const favoritesData = await getFavorites();
        setFavorites(favoritesData);
        
        // Fetch user reviews
        const reviewsData = await getUserReviews(user.id);
        setReviews(reviewsData);
        
        // Set initial user info
        setUserInfo({
          displayName: user.name || '',
          photoURL: user.avatar || '',
        });
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        showToast('error', 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, navigate]);
  
  // Update user profile information
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updatedUser = await updateUserProfile(user.id, userInfo, fileUpload);
      // Update local state with the returned user data
      setUserInfo({
        displayName: updatedUser.name || updatedUser.displayName || '',
        photoURL: updatedUser.avatar || updatedUser.photoURL || '',
      });
      setIsEditing(false);
      showToast('success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileUpload(e.target.files[0]);
      // Show a preview
      setUserInfo(prev => ({
        ...prev,
        photoURL: URL.createObjectURL(e.target.files[0])
      }));
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      showToast('success', 'Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      showToast('error', 'Failed to log out');
    }
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
          {/* Profile Header */}
          <div className="relative h-40 bg-gradient-to-r from-primary to-secondary md:h-60">
            <div className="absolute -bottom-16 left-8 md:left-12">
              <div className="relative">
                <img 
                  src={userInfo.photoURL || 'https://via.placeholder.com/150?text=User'} 
                  alt={user?.name || 'User'} 
                  className="h-32 w-32 rounded-full border-4 border-white object-cover md:h-40 md:w-40" 
                />
                {isEditing && (
                  <label htmlFor="photo-upload" className="absolute bottom-2 right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-secondary text-white hover:bg-secondary/80">
                    <FaCamera />
                    <input 
                      type="file"
                      id="photo-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>
            
            <div className="absolute bottom-4 right-8">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center rounded-full bg-white px-4 py-2 font-medium text-gray-800 shadow transition-colors hover:bg-gray-100"
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="rounded-full bg-gray-200 px-4 py-2 font-medium text-gray-800 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleProfileUpdate}
                    className="rounded-full bg-secondary px-4 py-2 font-medium text-white hover:bg-secondary/80"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mb-6 mt-20 flex border-b border-gray-200 pl-8 pt-4 dark:border-gray-700 md:pl-12">
            <button
              className={`mr-4 border-b-2 pb-4 pt-2 font-medium ${
                activeTab === 'profile' 
                  ? 'border-secondary text-secondary' 
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              <FaUser className="mr-2 inline-block" />
              Profile
            </button>
            <button
              className={`mr-4 border-b-2 pb-4 pt-2 font-medium ${
                activeTab === 'favorites' 
                  ? 'border-secondary text-secondary' 
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setActiveTab('favorites')}
            >
              <FaFilm className="mr-2 inline-block" />
              Favorites
            </button>
            <button
              className={`mr-4 border-b-2 pb-4 pt-2 font-medium ${
                activeTab === 'reviews' 
                  ? 'border-secondary text-secondary' 
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              <FaStar className="mr-2 inline-block" />
              Reviews
            </button>
          </div>
          
          {/* Profile Information */}
          {activeTab === 'profile' && (
            <div className="p-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Profile Information</h2>
              
              {isEditing ? (
                <form className="space-y-6">
                  <div>
                    <label htmlFor="displayName" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Display Name
                    </label>
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={userInfo.displayName}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/50 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
                      <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Display Name</div>
                      <div className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
                        <FaUser className="mr-2 text-secondary" />
                        {user?.name || 'Not set'}
                      </div>
                    </div>
                    
                    <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
                      <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</div>
                      <div className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
                        <FaEnvelope className="mr-2 text-secondary" />
                        {user?.email}
                      </div>
                    </div>
                    
                    <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
                      <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Account Created</div>
                      <div className="flex items-center text-lg font-medium text-gray-900 dark:text-white">
                        <FaCalendarAlt className="mr-2 text-secondary" />
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : 'Not available'}
                      </div>
                    </div>
                    
                    <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-700">
                      <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">Account Stats</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Favorites</div>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">{favorites.length}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Reviews</div>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">{reviews.length}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <button
                      onClick={handleLogout}
                      className="flex items-center rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="p-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Your Favorite Movies</h2>
              
              {favorites.length === 0 ? (
                <div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-700">
                  <p className="text-lg text-gray-500 dark:text-gray-300">
                    You haven't added any favorites yet.
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-4 rounded-lg bg-secondary px-6 py-2 font-medium text-white hover:bg-secondary/80"
                  >
                    Discover Movies
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {favorites.map(movie => (
                    <MovieCard 
                      key={movie.id}
                      movie={movie}
                      isFavorite={true}
                      onFavoriteToggle={() => {}}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="p-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Your Reviews</h2>
              
              {reviews.length === 0 ? (
                <div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-700">
                  <p className="text-lg text-gray-500 dark:text-gray-300">
                    You haven't written any reviews yet.
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-4 rounded-lg bg-secondary px-6 py-2 font-medium text-white hover:bg-secondary/80"
                  >
                    Discover Movies
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div 
                      key={review.id} 
                      className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 md:flex-row"
                    >
                      {review.movie?.poster_path && (
                        <div className="w-full md:w-1/4">
                          <img 
                            src={getImageUrl(review.movie.poster_path)} 
                            alt={review.movie.title}
                            className="h-48 w-full object-cover md:h-full"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col justify-between p-6">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {review.movie?.title || 'Unknown Movie'}
                            </h3>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                          </div>
                          <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                            {review.title}
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300">
                            {review.content}
                          </p>
                        </div>
                        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                          Posted on {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={() => navigate(`/movie/${review.movieId}`)}
                            className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary/80"
                          >
                            View Movie
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;