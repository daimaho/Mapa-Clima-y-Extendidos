import React from 'react';
import { ProcessedLocationData } from '../types';
import WeatherCard from './WeatherCard';

interface LocationDisplayProps {
  data: ProcessedLocationData;
  isVisible: boolean;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ data, isVisible }) => {
  const visibilityClass = isVisible ? 'opacity-100' : 'opacity-0';

  return (
    <div className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${visibilityClass}`}>
      <div className="flex flex-col h-full w-full items-center justify-center p-8 text-white">
        <div 
          className="bg-black/25 backdrop-blur-md px-10 py-2 rounded-lg mb-4 shadow-2xl border border-white/10"
          style={{textShadow: '2px 2px 5px rgba(0,0,0,0.5)'}}
        >
          <h1 className="text-5xl font-bold tracking-wider text-center">{data.location.name}</h1>
        </div>
        
        {data.currentWeatherSummary && (
          <div className="w-full max-w-4xl text-center mb-4 min-h-[3rem]">
              <p 
                className="text-2xl italic" 
                style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}
              >
                  "{data.currentWeatherSummary}"
              </p>
          </div>
        )}
        
        <div className="w-full max-w-6xl grid grid-cols-2 grid-rows-2 gap-6" style={{height: '65vh'}}>
          {data.forecasts.map((day) => (
            <WeatherCard key={day.dayName} forecast={day} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationDisplay;