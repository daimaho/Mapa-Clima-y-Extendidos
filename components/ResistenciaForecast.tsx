
import React from 'react';
import { ProcessedLocationData } from '../types';
import TimeOfDayCard from './TimeOfDayCard';

interface ResistenciaForecastProps {
  data: ProcessedLocationData;
}

const ResistenciaForecast: React.FC<ResistenciaForecastProps> = ({ data }) => {
  if (!data || !data.timeOfDayForecasts || data.timeOfDayForecasts.length === 0) {
    return <div className="text-white text-3xl flex items-center justify-center h-full">Datos del día no disponibles para Resistencia.</div>;
  }

  // Ensure we only show a maximum of 3 cards
  const forecastsToShow = data.timeOfDayForecasts.slice(0, 3);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
        <div 
          className="bg-[#1A4B6B] px-16 py-3 rounded-lg mb-6 shadow-2xl"
          style={{textShadow: '2px 2px 5px rgba(0,0,0,0.5)'}}
        >
          <h1 className="text-5xl font-bold tracking-widest text-center">{data.location.name}</h1>
        </div>
        
        <div className="flex justify-center items-center gap-6">
          {forecastsToShow.map((forecast) => (
            <TimeOfDayCard key={forecast.period} forecast={forecast} />
          ))}
        </div>
    </div>
  );
};

export default ResistenciaForecast;
