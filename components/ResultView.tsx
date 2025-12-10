import React from 'react';

interface ResultViewProps {
  originalUrl: string;
  colorizedUrl: string | null;
  isLoading: boolean;
  onDownload: () => void;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ 
  originalUrl, 
  colorizedUrl, 
  isLoading, 
  onDownload,
  onReset
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto mt-8 px-4">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Original Image */}
        <div className="flex flex-col items-center">
          <h3 className="text-slate-400 font-semibold mb-3 tracking-wide text-sm uppercase">Original B&W</h3>
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800 w-full aspect-[4/5] md:aspect-auto">
             <img 
               src={originalUrl} 
               alt="Original Black and White" 
               className="w-full h-full object-contain"
             />
          </div>
        </div>

        {/* Result Image */}
        <div className="flex flex-col items-center">
          <h3 className="text-indigo-400 font-semibold mb-3 tracking-wide text-sm uppercase">
            {isLoading ? 'Processing...' : 'Colorized Result'}
          </h3>
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800 w-full aspect-[4/5] md:aspect-auto flex items-center justify-center">
             {isLoading ? (
               <div className="flex flex-col items-center justify-center p-8 space-y-4">
                 <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-slate-400 animate-pulse text-sm">Analyzing light & texture...</p>
               </div>
             ) : colorizedUrl ? (
               <img 
                 src={colorizedUrl} 
                 alt="Colorized Result" 
                 className="w-full h-full object-contain"
               />
             ) : (
               <div className="text-slate-600 text-sm">Waiting for generation...</div>
             )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pb-12">
        {!isLoading && colorizedUrl && (
          <button 
            onClick={onDownload}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5"
          >
            Download Colorized
          </button>
        )}
        
        <button 
          onClick={onReset}
          className={`px-8 py-3 rounded-lg font-semibold transition-all border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {colorizedUrl ? 'Start Over' : 'Cancel / Change Photo'}
        </button>
      </div>
    </div>
  );
};
