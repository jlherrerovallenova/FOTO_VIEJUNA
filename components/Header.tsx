import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-8 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-500 mb-2">
        RetroColor AI
      </h1>
      <p className="text-slate-400 text-lg max-w-xl mx-auto">
        Bring your memories to life. Upload an old black & white photo and watch it transform into modern color instantly.
      </p>
    </header>
  );
};
