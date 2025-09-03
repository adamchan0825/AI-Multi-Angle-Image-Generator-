
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { GeneratedImage } from './types';
import { generateAllViews } from './services/geminiService';

const App: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    setOriginalFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setGeneratedImages([]);
    setError(null);
  }, []);

  const handleReset = useCallback(() => {
    setOriginalFile(null);
    setPreviewUrl(null);
    setGeneratedImages([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleGenerate = async () => {
    if (!originalFile) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setProgressMessage('準備開始...');

    try {
      const results = await generateAllViews(originalFile, (message) => {
        setProgressMessage(message);
      });
      setGeneratedImages(results);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : '發生未知錯誤，請再試一次。');
    } finally {
      setIsLoading(false);
      setProgressMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            AI 多視角圖片生成器
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            上傳一張圖片，AI 將自動為您去背並生成六種不同的視角圖。
          </p>
        </header>

        <main className="w-full">
          {!originalFile ? (
            <ImageUploader onImageSelect={handleImageSelect} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col items-center bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
                <h2 className="text-2xl font-semibold mb-4 text-gray-200">原始圖片</h2>
                <div className="w-full max-w-md aspect-square bg-gray-700/50 rounded-xl flex items-center justify-center overflow-hidden">
                    {previewUrl && <img src={previewUrl} alt="Original Upload" className="max-w-full max-h-full object-contain" />}
                </div>
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                  >
                    {isLoading ? '生成中...' : '開始生成視角圖'}
                  </button>
                   <button
                    onClick={handleReset}
                    disabled={isLoading}
                    className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                  >
                    重新上傳
                  </button>
                </div>
              </div>
              <div className="flex flex-col">
                {isLoading && <Loader message={progressMessage} />}
                {error && <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center">{error}</div>}
                {!isLoading && generatedImages.length > 0 && <ResultDisplay images={generatedImages} />}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
