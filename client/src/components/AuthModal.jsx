import { useState, useEffect } from 'react';
import { FaUser, FaLock, FaEnvelope, FaTimes, FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  const { login, register, loading } = useAuth();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setFormErrors({});
    }
  }, [isOpen, mode]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    const errors = {};
    const { name, email, password, confirmPassword } = formData;
    
    if (mode === 'signup' && !name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (mode === 'signup' && password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    let success = false;
    
    if (mode === 'login') {
      const { email, password } = formData;
      success = await login({ email, password });
    } else {
      const { name, email, password } = formData;
      success = await register({ name, email, password });
    }
    
    if (success) {
      onClose();
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setFormErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-800">
        {/* Header */}
        <div className="relative border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-2xl font-bold">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button 
            className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            onClick={onClose}
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        {/* Body */}
        <div className="px-6 py-6">
          <form onSubmit={handleSubmit}>
            {/* Name field - only for signup */}
            {mode === 'signup' && (
              <div className="mb-4">
                <label htmlFor="modal-name" className="mb-1 block font-medium">
                  Name
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaUser className="text-gray-500" />
                  </div>
                  <input
                    id="modal-name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } bg-white py-3 pl-10 pr-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900`}
                  />
                </div>
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                )}
              </div>
            )}

            {/* Email field */}
            <div className="mb-4">
              <label htmlFor="modal-email" className="mb-1 block font-medium">
                Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaEnvelope className="text-gray-500" />
                </div>
                <input
                  id="modal-email"
                  name="email"
                  type="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                  } bg-white py-3 pl-10 pr-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900`}
                />
              </div>
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div className="mb-4">
              <label htmlFor="modal-password" className="mb-1 block font-medium">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  id="modal-password"
                  name="password"
                  type="password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${
                    formErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                  } bg-white py-3 pl-10 pr-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900`}
                />
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
              )}
            </div>

            {/* Confirm Password field - only for signup */}
            {mode === 'signup' && (
              <div className="mb-6">
                <label htmlFor="modal-confirmPassword" className="mb-1 block font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    id="modal-confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${
                      formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } bg-white py-3 pl-10 pr-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-900`}
                  />
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-secondary to-primary py-3 font-semibold text-white shadow-md transition-all hover:translate-y-[-2px] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70"
            >
              {loading ? (
                <Loader size="small" />
              ) : mode === 'login' ? (
                <>
                  <FaSignInAlt className="mr-2" />
                  Sign In
                </>
              ) : (
                <>
                  <FaUserPlus className="mr-2" />
                  Create Account
                </>
              )}
            </button>
          </form>
          
          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={switchMode}
                className="ml-2 font-semibold text-secondary hover:underline"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 