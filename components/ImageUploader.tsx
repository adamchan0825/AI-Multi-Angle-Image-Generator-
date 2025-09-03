
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  }, [onImageSelect]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex items-center justify-center">
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`w-full h-80 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${isDragging ? 'border-indigo-500 bg-indigo-900/30' : 'border-gray-600 hover:border-indigo-600 hover:bg-gray-800/50'}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
          <UploadIcon className="w-12 h-12 mb-4 text-gray-400" />
          <p className="mb-2 text-lg font-semibold text-gray-300">
            <span className="text-indigo-400">點擊上傳</span> 或拖曳檔案到此處
          </p>
          <p className="text-sm text-gray-500">支援 PNG, JPG, WEBP 等格式</p>
        </div>
        <input 
          id="dropzone-file" 
          type="file" 
          className="hidden" 
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange} 
        />
      </label>
    </div>
  );
};
