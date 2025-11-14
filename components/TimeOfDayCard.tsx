import React from 'react';
import { TimeOfDayForecast } from '../types';
import { ICON_PATH } from '../constants';

interface TimeOfDayCardProps {
  forecast: TimeOfDayForecast;
}

const TimeOfDayCard: React.FC<TimeOfDayCardProps> = ({ forecast }) => {
  return (
    <div 
        className="relative w-[380px] h-[530px] bg-cover bg-center text-white flex flex-col items-center justify-between p-3 shadow-2xl rounded-2xl overflow-hidden"
        style={{ backgroundImage: "url('/cont_3.webp')" }}
    >
        <div className="bg-[#E6007E] text-center w-full py-1.5 rounded-lg mt-1">
            <h3 className="font-bold text-3xl tracking-wider">{forecast.period}</h3>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center w-full -mt-4 pl-1">
            <div className="w-44 h-44">
                <video
                    src={`${ICON_PATH}${forecast.icon}`}
                    autoPlay loop muted playsInline
                    className="w-full h-full object-contain drop-shadow-lg"
                    key={forecast.icon}
                ></video>
            </div>

            <p className="font-bold text-8xl leading-none mt-2" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.5)' }}>
                {forecast.temp}°C
            </p>
        </div>

        <div className="w-full mb-3 px-3 pl-1">
            <div className="bg-[#2D758F] text-center w-full py-2.5 rounded-lg">
                <p className="font-semibold text-3xl tracking-wider">{forecast.pop}</p>
            </div>
        </div>
    </div>
  );
};

export default TimeOfDayCard;