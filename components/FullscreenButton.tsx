import React, { useState } from 'react';

const FullscreenButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div
      className="fixed bottom-0 right-0 z-50"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <button
        onClick={toggleFullscreen}
        aria-label="Pantalla completa"
        className={`w-16 h-16 bg-black/50 backdrop-blur-sm rounded-tl-lg flex items-center justify-center
                   transition-all duration-300 ease-in-out cursor-pointer focus:outline-none
                   ${isVisible ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 translate-x-full translate-y-full'}`}
      >
        {isFullscreen ? (
          // Icono de salir de pantalla completa
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          // Icono de pantalla completa
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default FullscreenButton;