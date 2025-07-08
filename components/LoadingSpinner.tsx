
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
        <p className="text-lg font-semibold text-gray-700">AIが議事録を生成中です...</p>
        <p className="text-sm text-gray-500">しばらくお待ちください</p>
    </div>
  );
};

export default LoadingSpinner;
