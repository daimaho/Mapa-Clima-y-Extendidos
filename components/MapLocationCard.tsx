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
      className="absolute w-[180px] h-[140px] transition-opacity duration-300"
      style={{
        ...position,
        opacity: isVisible ? 1 : 0,
        transform: 'translate(-50%, -50%)', // Center the card on the position
      }}
    >
      <div 
        className="relative w-full h-full bg-cover bg-center text-white flex flex-col items-center justify-start p-1 rounded-lg shadow-2xl"
        style={{ backgroundImage: "url('/cont_1.webp')" }}
      >
        <div className="bg-[#E6007E] text-center w-full py-1 rounded-md">
          <h3 className="font-bold text-base leading-tight tracking-wide">{locationName}</h3>
        </div>
        <div className="flex-grow w-full flex items-center justify-around pt-1">
          <p 
            className="font-bold text-6xl"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
          >
            {weather.temp}°
          </p>
          <div className="w-20 h-20">
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
    </div>
  );
};

export default MapLocationCard;
