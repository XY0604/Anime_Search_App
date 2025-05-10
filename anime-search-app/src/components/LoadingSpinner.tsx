import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      <p className="ml-4 text-xl text-gray-700">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;