import React from 'react';

const Loader = ({ size = 'medium' }) => {
  const sizeClass = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`${sizeClass[size]} animate-spin rounded-full border-4 border-solid border-gray-200 border-t-secondary`}
      ></div>
    </div>
  );
};

export default Loader; 