import { useState, useCallback, useEffect } from 'react';
import Toast from './Toast';

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  // Listen for custom toast events
  useEffect(() => {
    const showToast = (event) => {
      const { message, type, duration } = event.detail;
      addToast(message, type, duration);
    };

    // Add event listener
    window.addEventListener('show-toast', showToast);

    return () => {
      window.removeEventListener('show-toast', showToast);
    };
  }, []);

  // Add a new toast
  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now().toString();
    setToasts(prevToasts => [...prevToasts, { id, message, type, duration }]);
  }, []);

  // Remove a toast by id
  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed left-1/2 top-4 z-50 flex -translate-x-1/2 flex-col items-center gap-3 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

// Helper function to show toasts from anywhere in the app
export const showToast = (message, type = 'info', duration = 5000) => {
  window.dispatchEvent(
    new CustomEvent('show-toast', {
      detail: { message, type, duration }
    })
  );
};

export default ToastContainer; 