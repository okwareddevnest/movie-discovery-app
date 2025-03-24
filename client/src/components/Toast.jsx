import { useState, useEffect } from 'react';
import { FaCheckCircle, FaInfoCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

// Toast types and their corresponding icons and colors
const TOAST_TYPES = {
  success: {
    icon: <FaCheckCircle />,
    bgColor: 'bg-green-600',
    borderColor: 'border-green-800'
  },
  error: {
    icon: <FaExclamationCircle />,
    bgColor: 'bg-red-600',
    borderColor: 'border-red-800'
  },
  info: {
    icon: <FaInfoCircle />,
    bgColor: 'bg-blue-600',
    borderColor: 'border-blue-800'
  },
  warning: {
    icon: <FaExclamationCircle />,
    bgColor: 'bg-yellow-500',
    borderColor: 'border-yellow-700'
  }
};

const Toast = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(duration);
  const { icon, bgColor, borderColor } = TOAST_TYPES[type] || TOAST_TYPES.info;

  useEffect(() => {
    // Start timer when toast appears
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    // Animation timer
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) return 0;
        return prev - 100;
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Wait for exit animation to complete
  };

  const progressPercentage = (timeLeft / duration) * 100;

  return (
    <div
      className={`max-w-md overflow-hidden rounded-lg shadow-lg transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-20px]'
      }`}
    >
      <div className={`relative border-l-4 ${borderColor} ${bgColor} text-white`}>
        <div className="flex items-center p-4">
          <div className="mr-3 text-xl">
            {icon}
          </div>
          <div className="mr-8 flex-1">
            <p className="font-medium">{message}</p>
          </div>
          <button 
            onClick={handleClose}
            className="rounded-full p-1 transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Progress bar */}
        <div 
          className="h-1 bg-white/30"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default Toast; 