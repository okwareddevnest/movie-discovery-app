import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { showToast } from '../components/ToastContainer';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Mock auth API calls
  const mockApiCall = async (data, success = true, delay = 800) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (success) {
          resolve(data);
        } else {
          reject(new Error('API call failed'));
        }
      }, delay);
    });
  };

  // Check if user is already logged in
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          // In a real app, validate the token with the server here
          setUser(JSON.parse(storedUser));
        } catch (error) {
          localStorage.removeItem('user');
        }
      }
      setAuthChecked(true);
    };

    checkUserLoggedIn();
  }, []);

  const login = useCallback(async ({ email, password }) => {
    try {
      setLoading(true);
      
      // In a real app, make an API call to authenticate
      const userData = await mockApiCall({
        id: '1',
        name: 'John Doe',
        email,
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
      });
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      showToast('Logged in successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      showToast('Login failed. Please check your credentials.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    try {
      setLoading(true);
      
      // In a real app, make an API call to register
      const userData = await mockApiCall({
        id: Date.now().toString(),
        name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random`
      });
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      showToast('Account created successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      showToast('Registration failed. Please try again.', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
    showToast('Logged out successfully', 'info');
  }, []);

  const updateProfile = useCallback(async (userData) => {
    try {
      setLoading(true);
      
      // In a real app, make an API call to update user data
      const updatedUser = await mockApiCall({
        ...user,
        ...userData,
        avatar: `https://ui-avatars.com/api/?name=${userData.name.replace(' ', '+')}&background=random`
      });
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      showToast('Profile updated successfully!', 'success');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      showToast('Failed to update profile', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const value = {
    user,
    loading,
    authChecked,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 