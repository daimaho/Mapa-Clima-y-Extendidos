
import React from 'react';

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      aria-label="Volver al menú principal"
      className="fixed left-0 top-1/2 -translate-y-1/2 z-50 w-12 h-24 bg-black/50 backdrop-blur-sm rounded-r-lg flex items-center justify-center
                 opacity-0 -translate-x-full group-hover:opacity-100 group-hover:translate-x-0 
                 transition-all duration-300 ease-in-out cursor-pointer focus:outline-none focus:opacity-100 focus:translate-x-0"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
};

export default BackButton;
