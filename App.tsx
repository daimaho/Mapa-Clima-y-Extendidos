import React, { useState, useEffect, useCallback } from 'react';
import { LOCATIONS, BACKGROUND_VIDEO_URL, API_KEY } from './constants';
import { fetchWeatherForLocation } from './services/weatherService';
import type { ProcessedLocationData } from './types';
import LocationDisplay from './components/LocationDisplay';
import WeatherMap from './components/WeatherMap';
import ResistenciaForecast from './components/ResistenciaForecast';
import BackButton from './components/BackButton';
import FullscreenButton from './components/FullscreenButton';

type View = 'home' | 'forecast' | 'map' | 'resistencia';

const App: React.FC = () => {
    // Proactive check for API Key configuration
    if (API_KEY === "REPLACE_WITH_YOUR_API_KEY" || !API_KEY) {
        return (
            <div className="flex items-center justify-center h-screen text-white text-3xl p-10 text-center bg-red-900">
                <div>
                    <h1 className="text-5xl font-bold mb-4">CONFIGURACIÓN REQUERIDA</h1>
                    <p className="mb-2">Falta la API Key de OpenWeather.</p>
                    <p>Por favor, edita el archivo <code className="bg-black px-2 py-1 rounded text-yellow-300">constants.ts</code> y reemplaza <code className="bg-black px-2 py-1 rounded text-yellow-300">"REPLACE_WITH_YOUR_API_KEY"</code> con tu API Key.</p>
                </div>
            </div>
        );
    }

    const [view, setView] = useState<View>('home');
    const [weatherData, setWeatherData] = useState<ProcessedLocationData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);
    const [updateStatus, setUpdateStatus] = useState<{message: string, type: 'success' | 'error'} | null>(null);


    const fetchAllWeatherData = useCallback(async () => {
        setIsLoading(true);
        setUpdateStatus(null);
        try {
            const dataPromises = LOCATIONS.map(location => fetchWeatherForLocation(location));
            const results = await Promise.all(dataPromises);
            setWeatherData(results);
            setDataFetched(true);
            setUpdateStatus({ message: 'Datos actualizados', type: 'success' });
        } catch (err) {
            console.error("Failed to fetch weather data:", err);
            let errorMessage = "Error al cargar los datos. Verifica tu conexión a internet.";
            if (err instanceof Error && err.message.includes("401")) {
                errorMessage = "Error de autenticación (401). Tu API_KEY en 'constants.ts' es incorrecta o ha expirado.";
            }
            setUpdateStatus({ message: errorMessage, type: 'error' });
            setDataFetched(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (isLoading) return;
            
            // Global shortcuts: Ctrl + Numpad 1/2/3 para cambiar de vista
            if (event.ctrlKey && !dataFetched) return; // No permitir cambio si no hay datos
            
            if (event.ctrlKey) {
                switch (event.key) {
                    case '1':
                    case 'End': // Numpad 1
                        event.preventDefault();
                        setView('forecast');
                        setCurrentIndex(0); // Reset to first location
                        return;
                    case '2':
                    case 'ArrowDown': // Numpad 2
                        event.preventDefault();
                        setView('map');
                        return;
                    case '3':
                    case 'PageDown': // Numpad 3
                        event.preventDefault();
                        setView('resistencia');
                        return;
                }
            }

            // View-specific navigation
            if (view === 'home') return;
            
            if (view === 'forecast') {
                // Arrow keys for navigation
                if (event.key === 'ArrowRight') {
                    setCurrentIndex(prev => (prev + 1) % weatherData.length);
                    return;
                }
                if (event.key === 'ArrowLeft') {
                    setCurrentIndex(prev => (prev - 1 + weatherData.length) % weatherData.length);
                    return;
                }
                
                // Escape to go back
                if (event.key === 'Escape') {
                    setView('home');
                    return;
                }
                
                // Number keys (1-9) and Numpad keys for direct location access
                const numberKey = event.key;
                const numpadMap: {[key: string]: number} = {
                    'End': 1,           // Numpad 1
                    'ArrowDown': 2,     // Numpad 2
                    'PageDown': 3,      // Numpad 3
                    'ArrowLeft': 4,     // Numpad 4
                    'Clear': 5,         // Numpad 5
                    'ArrowRight': 6,    // Numpad 6
                    'Home': 7,          // Numpad 7
                    'ArrowUp': 8,       // Numpad 8
                    'PageUp': 9,        // Numpad 9
                };
                
                let locationNumber: number | null = null;
                
                // Check if it's a regular number key (1-9)
                if (!event.ctrlKey && !isNaN(parseInt(numberKey)) && parseInt(numberKey) >= 1 && parseInt(numberKey) <= 9) {
                    locationNumber = parseInt(numberKey);
                }
                // Check if it's a numpad key (without Ctrl pressed)
                else if (!event.ctrlKey && numpadMap[numberKey]) {
                    locationNumber = numpadMap[numberKey];
                }
                
                if (locationNumber !== null && locationNumber <= weatherData.length) {
                    event.preventDefault();
                    setCurrentIndex(locationNumber - 1);
                }
            } else if (view === 'map' || view === 'resistencia') {
                if (event.key === 'Escape') {
                    setView('home');
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isLoading, view, weatherData.length, dataFetched]);
    
    const renderForecastScreen = () => (
        <>
            {dataFetched && weatherData.length > 0 && (
                <div className="relative w-full h-full">
                    {weatherData.map((data, index) => (
                        <LocationDisplay
                            key={data.location.name}
                            data={data}
                            isVisible={index === currentIndex}
                        />
                    ))}
                </div>
            )}
        </>
    );

    const renderMapScreen = () => (
        <>
            {dataFetched && weatherData.length > 0 && (
                <WeatherMap allWeatherData={weatherData} />
            )}
        </>
    );

    const renderResistenciaScreen = () => (
        <>
            {dataFetched && weatherData.length > 0 && (
                 <ResistenciaForecast data={weatherData[0]} />
            )}
        </>
    );
    
    const ViewButton = ({ label, description, targetView }: { label: string, description: string, targetView: View }) => (
        <button
            onClick={() => setView(targetView)}
            disabled={!dataFetched || isLoading}
            className="bg-black bg-opacity-40 p-6 rounded-xl border border-white/20 text-left hover:bg-opacity-60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <h2 className="text-3xl font-semibold mb-3">{label}</h2>
            <p className="opacity-80">{description}</p>
        </button>
    );

    return (
        <div className="relative w-screen h-screen bg-black overflow-hidden">
            <video
                src={BACKGROUND_VIDEO_URL}
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
            ></video>
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-10"></div>
            
            <main className={`relative z-20 w-full h-full ${view !== 'home' ? 'group' : ''}`}>
                {view !== 'home' && <BackButton onClick={() => setView('home')} />}
                <FullscreenButton />

                {view === 'home' && (
                    <div className="flex flex-col items-center justify-center h-full text-white p-8 text-center">
                        <div className="bg-black bg-opacity-25 p-8 rounded-2xl backdrop-blur-md">
                            <h1 className="text-6xl font-bold tracking-wider mb-10">MENÚ PRINCIPAL</h1>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl mb-10">
                               <ViewButton label="Pronóstico Extendido" description="Vista detallada para los próximos 4 días." targetView="forecast" />
                               <ViewButton label="Mapa Clima" description="Vista de la provincia con el clima actual." targetView="map" />
                               <ViewButton label="Clima en Resistencia" description="Pronóstico del día: mañana, tarde y noche." targetView="resistencia" />
                            </div>
                            
                            <div className='flex flex-col items-center justify-center gap-4'>
                                <button
                                    onClick={fetchAllWeatherData}
                                    disabled={isLoading}
                                    className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-bold text-2xl px-10 py-4 rounded-lg disabled:opacity-50 disabled:cursor-wait"
                                >
                                    {isLoading ? 'Actualizando...' : 'Actualizar Datos'}
                                </button>
                                {updateStatus && (
                                    <p className={`text-xl ${updateStatus.type === 'error' ? 'text-red-400' : 'text-green-300'}`}>
                                        {updateStatus.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {view === 'forecast' && renderForecastScreen()}
                {view === 'map' && renderMapScreen()}
                {view === 'resistencia' && renderResistenciaScreen()}
            </main>
        </div>
    );
};

export default App;