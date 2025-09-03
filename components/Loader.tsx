
import React from 'react';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
      <div className="w-12 h-12 border-4 border-t-indigo-500 border-gray-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-300">{message || '處理中...'}</p>
    </div>
  );
};
