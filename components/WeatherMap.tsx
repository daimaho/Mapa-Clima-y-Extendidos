import React, { useState, useEffect } from 'react';
import { ProcessedLocationData } from '../types';
import { MAP_DISPLAY_LOCATIONS } from '../constants';
import MapLocationCard from './MapLocationCard';

interface WeatherMapProps {
  allWeatherData: ProcessedLocationData[];
}

const WeatherMap: React.FC<WeatherMapProps> = ({ allWeatherData }) => {
  const [visibleCards, setVisibleCards] = useState<string[]>([]);

  useEffect(() => {
    const animationStartTime = 1000; // 1 second
    const totalDuration = 140; // 140ms
    const delayBetween = totalDuration / (MAP_DISPLAY_LOCATIONS.length - 1);

    const timeouts = MAP_DISPLAY_LOCATIONS.map((loc, index) => {
      return setTimeout(() => {
        setVisibleCards(prev => [...prev, loc.name]);
      }, animationStartTime + index * delayBetween);
    });

    // Cleanup timeouts on component unmount
    return () => {
        timeouts.forEach(clearTimeout);
    };

  }, []);

  const mapData = MAP_DISPLAY_LOCATIONS.map(displayLoc => {
    const weatherInfo = allWeatherData.find(data => data.location.name === displayLoc.name);
    return { ...displayLoc, weatherInfo };
  }).filter(item => !!item.weatherInfo); // Filter out if data not found

  return (
    <div className="relative w-full h-full">
      <video
        src="/mapa.webm"
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-contain z-10"
      />
      <div className="absolute inset-0 z-20">
        {mapData.map(data => (
          <MapLocationCard
            key={data.name}
            locationName={data.shortName}
            weather={data.weatherInfo!.currentWeather}
            position={data.pos}
            isVisible={visibleCards.includes(data.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default WeatherMap;
