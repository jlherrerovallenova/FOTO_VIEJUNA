import React, { useCallback } from 'react';

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect, disabled }) => {
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  }, [onFileSelect]);

  return (
    <div className="w-full max-w-xl mx-auto">
      <label 
        className={`
          flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl 
          cursor-pointer transition-all duration-300
          ${disabled 
            ? 'border-slate-700 bg-slate-800/50 opacity-50 cursor-not-allowed' 
            : 'border-slate-600 bg-slate-800 hover:bg-slate-700/80 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          <svg className="w-12 h-12 mb-4 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>
          <p className="mb-2 text-sm text-slate-300 font-semibold">
            <span className="text-indigo-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500">
            JPG, PNG or WEBP (Max 5MB)
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleInputChange}
          disabled={disabled}
        />
      </label>
    </div>
  );
};
