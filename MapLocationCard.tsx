import React from 'react';
import { CurrentWeather } from '../types';
import { ICON_PATH } from '../constants';

interface MapLocationCardProps {
  locationName: string;
  weather: CurrentWeather;
  position: { top: string; left: string };
  isVisible: boolean;
}

const MapLocationCard: React.FC<MapLocationCardProps> = ({ locationName, weather, position, isVisible }) => {
  return (
    <div
      className="absolute w-[145px] h-[185px] transition-opacity duration-300"
      style={{
        ...position,
        opacity: isVisible ? 1 : 0,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div 
        className="relative w-full h-full bg-cover bg-center text-white flex flex-col items-center justify-between p-1 rounded-lg shadow-2xl"
        style={{ backgroundImage: "url('/cont_1.webp')" }}
      >
        <div className="bg-[#E6007E] text-center w-full py-1 rounded-md">
          <h3 className="font-bold text-base leading-tight tracking-wide">{locationName}</h3>
        </div>
        
        <div className="flex-grow flex items-center justify-center">
          <p 
            className="font-bold text-6xl"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
          >
            {weather.temp}°
          </p>
        </div>

        <div className="w-24 h-24 mb-1">
          <video
            src={`${ICON_PATH}${weather.icon}`}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain drop-shadow-lg"
            key={weather.icon}
          ></video>
        </div>
      </div>
    </div>
  );
};

export default MapLocationCard;