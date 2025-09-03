
import React from 'react';
import { GeneratedImage } from '../types';

interface ResultDisplayProps {
  images: GeneratedImage[];
}

const ImageCard: React.FC<{ image: GeneratedImage }> = ({ image }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col">
    <div className="p-3 bg-gray-700/50">
        <h3 className="text-md font-semibold text-center text-gray-200">{image.view}</h3>
    </div>
    <div className="aspect-square p-2 flex-grow flex items-center justify-center">
      <img src={image.src} alt={image.view} className="max-w-full max-h-full object-contain" />
    </div>
  </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ images }) => {
  const mainImage = images.find(img => img.view === '去背主圖');
  const otherImages = images.filter(img => img.view !== '去背主圖');

  return (
    <div className="w-full">
      {mainImage && (
        <div className="mb-8">
          <ImageCard image={mainImage} />
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {otherImages.map((image) => (
          <ImageCard key={image.view} image={image} />
        ))}
      </div>
    </div>
  );
};
