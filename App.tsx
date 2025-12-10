import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultView } from './components/ResultView';
import { colorizeImage } from './services/geminiService';
import { AppState, ProcessedImage } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    // Reset state for new file
    setError(null);
    setAppState(AppState.IDLE);

    // Create a local URL for the preview
    const objectUrl = URL.createObjectURL(file);
    
    setProcessedImage({
      originalUrl: objectUrl,
      colorizedUrl: null,
      mimeType: file.type
    });

    // Auto start processing
    startProcessing(file);
  }, []);

  const startProcessing = async (file: File) => {
    setAppState(AppState.PROCESSING);
    try {
      const resultBase64 = await colorizeImage(file);
      setProcessedImage(prev => prev ? { ...prev, colorizedUrl: resultBase64 } : null);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError("We encountered an issue transforming the image. Please try a different photo or ensure it's a valid image format.");
      setAppState(AppState.ERROR);
    }
  };

  const handleDownload = () => {
    if (processedImage?.colorizedUrl) {
      const link = document.createElement('a');
      link.href = processedImage.colorizedUrl;
      link.download = `retrocolor-result-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    if (processedImage?.originalUrl) {
      URL.revokeObjectURL(processedImage.originalUrl);
    }
    setProcessedImage(null);
    setAppState(AppState.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <Header />

        <main className="flex flex-col items-center w-full">
          
          {/* Error Message */}
          {error && (
            <div className="w-full max-w-xl mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Conditional Rendering based on state */}
          {!processedImage ? (
            <div className="w-full animate-fade-in-up">
              <ImageUploader 
                onFileSelect={handleFileSelect} 
                disabled={appState === AppState.PROCESSING}
              />
              
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
                <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/30 transition-colors">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4 text-indigo-400 font-bold text-xl">1</div>
                  <h3 className="font-semibold text-white mb-2">Upload Photo</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Select your cherished black and white memories from your device.</p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/30 transition-colors">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4 text-indigo-400 font-bold text-xl">2</div>
                  <h3 className="font-semibold text-white mb-2">AI Processing</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Gemini analyzes lighting, texture, and context to hallucinate realistic colors.</p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/30 transition-colors">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4 text-indigo-400 font-bold text-xl">3</div>
                  <h3 className="font-semibold text-white mb-2">Instant Download</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Preview the side-by-side comparison and save the modernized photo.</p>
                </div>
              </div>
            </div>
          ) : (
            <ResultView 
              originalUrl={processedImage.originalUrl}
              colorizedUrl={processedImage.colorizedUrl}
              isLoading={appState === AppState.PROCESSING}
              onDownload={handleDownload}
              onReset={handleReset}
            />
          )}

        </main>
      </div>
    </div>
  );
};

export default App;
