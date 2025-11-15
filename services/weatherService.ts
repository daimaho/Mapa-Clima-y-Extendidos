import { API_BASE_URL, API_KEY, WEATHER_CONDITION_MAP, CONDITION_PRIORITY, CONDITION_TEXT_MAP_ES } from '../constants';
import type { Location, ProcessedLocationData, ForecastDay, OpenWeatherResponse, ForecastListItem, CurrentWeather, TimeOfDayForecast } from '../types';

// Cache the initialized AI client to avoid re-importing and re-initializing on every call.
let aiClient: any | null = null;

async function generateWeatherSummary(weather: CurrentWeather, locationName: string): Promise<string> {
    // First, check if the environment is set up for Gemini. If not, bail out immediately.
    if (typeof process === 'undefined' || !process.env || !process.env.API_KEY) {
        console.warn("Gemini API Key environment variable not found. Summary generation will be skipped.");
        return "Resumen del clima no disponible.";
    }

    try {
        // If the client hasn't been initialized yet, dynamically import and set it up.
        if (!aiClient) {
            const { GoogleGenAI } = await import('@google/genai');
            aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
        }

        const prompt = `Eres un presentador del tiempo para un canal de televisión en Chaco, Argentina. Genera un reporte breve y amigable (máximo 20 palabras) para la localidad de ${locationName}.`;
        
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const summaryText = response.text;
        return summaryText || "El análisis del clima no está disponible.";

    } catch (error) {
        console.error("Error during Gemini summary generation (import or API call):", error);
        // If anything goes wrong, return a safe default message.
        return "El análisis del clima no está disponible en este momento.";
    }
}


function normalizeCondition(id: number): string {
    return WEATHER_CONDITION_MAP[id] || 'clear';
}

function formatConditionText(condition: string): string {
    return CONDITION_TEXT_MAP_ES[condition] || condition;
}

function formatPop(pop: number): string { // pop is 0-1
    const p = Math.round(pop * 100);
    if (p < 10) return "0 - 10%";
    if (p < 40) return "10 - 40%";
    if (p < 70) return "40 - 70%";
    return "70 - 100%";
}


export const processWeatherData = (data: OpenWeatherResponse): Omit<ProcessedLocationData, 'currentWeatherSummary'> => {
    // Process current weather from the first item in the list
    const currentForecast = data.list[0];
    const currentConditionId = currentForecast.weather[0].id;
    const normalizedCurrentCondition = normalizeCondition(currentConditionId);
    const dayOrNightForCurrent = currentForecast.sys.pod === 'd' ? 'day' : 'night';
    let currentIconFilename = normalizedCurrentCondition;
    if (normalizedCurrentCondition === 'clear' || normalizedCurrentCondition === 'partly_cloudy') {
        currentIconFilename = `${normalizedCurrentCondition}_${dayOrNightForCurrent}`;
    }

    const currentWeather: CurrentWeather = {
        temp: Math.round(currentForecast.main.temp),
        condition: formatConditionText(normalizedCurrentCondition),
        icon: `${dayOrNightForCurrent}/${currentIconFilename}.webm`,
    };

    // Process daily forecasts for the next days
    const dailyData: { [key: string]: { temps: number[], conditions: { condition: string; pod: 'd' | 'n' }[] } } = {};

    // Get today's date in Argentina timezone (UTC-3)
    const nowUTC = new Date();
    const argentinaOffset = -3 * 60; // UTC-3 in minutes
    const argentinaTime = new Date(nowUTC.getTime() + argentinaOffset * 60 * 1000);
    const today = argentinaTime.toISOString().slice(0, 10);

    data.list.forEach((item: ForecastListItem) => {
        // Convert UTC datetime to Argentina timezone
        const itemDateUTC = new Date(item.dt_txt.replace(' ', 'T') + 'Z');
        const itemDateArgentina = new Date(itemDateUTC.getTime() + argentinaOffset * 60 * 1000);
        const dateStr = itemDateArgentina.toISOString().slice(0, 10);
        
        if (dateStr === today) return; // Skip today's data for the 4-day forecast section

        if (!dailyData[dateStr]) {
            dailyData[dateStr] = { temps: [], conditions: [] };
        }
        dailyData[dateStr].temps.push(item.main.temp_max, item.main.temp_min);
        dailyData[dateStr].conditions.push({
            condition: normalizeCondition(item.weather[0].id),
            pod: item.sys.pod,
        });
    });

    const forecasts: ForecastDay[] = Object.entries(dailyData)
        .slice(0, 4) // Take only the next 4 days
        .map(([dateStr, { temps, conditions }]) => {
            const date = new Date(dateStr + 'T12:00:00');
            const dayName = date.toLocaleDateString('es-ES', { 
                weekday: 'long',
                timeZone: 'America/Argentina/Buenos_Aires' 
            }).toUpperCase();
            
            const tempMax = Math.round(Math.max(...temps));
            const tempMin = Math.round(Math.min(...temps));
            
            let dominantCondition = 'clear';
            let icon = 'day/clear_day.webm'; // Default icon
            
            if (conditions && conditions.length > 0) {
                const dominantConditionEntry = conditions.reduce((a, b) => 
                    (CONDITION_PRIORITY[a.condition] > CONDITION_PRIORITY[b.condition] ? a : b)
                );
                dominantCondition = dominantConditionEntry.condition;
                const dayOrNight = dominantConditionEntry.pod === 'd' ? 'day' : 'night';
                
                let iconFilename = dominantCondition;
                if (dominantCondition === 'clear' || dominantCondition === 'partly_cloudy') {
                    iconFilename = `${dominantCondition}_${dayOrNight}`;
                }
                
                icon = `${dayOrNight}/${iconFilename}.webm`;
            }
            
            return {
                dayName,
                tempMax,
                tempMin,
                condition: formatConditionText(dominantCondition),
                icon,
            };
        });
    
    // Process today's forecast for Resistencia view
const timeOfDayForecasts: TimeOfDayForecast[] = [];

// Get today's date in Argentina timezone (UTC-3)
const nowUTC2 = new Date();
const argentinaOffset2 = -3 * 60; // UTC-3 in minutes
const argentinaTime2 = new Date(nowUTC2.getTime() + argentinaOffset2 * 60 * 1000);
const todayStr = argentinaTime2.toISOString().slice(0, 10);

// Calculate tomorrow's date
const tomorrowTime = new Date(argentinaTime2.getTime() + 24 * 60 * 60 * 1000);
const tomorrowStr = tomorrowTime.toISOString().slice(0, 10);

// Filter forecasts - convert each UTC datetime to Argentina timezone
const todayForecasts = data.list.filter(item => {
    const itemDateUTC = new Date(item.dt_txt.replace(' ', 'T') + 'Z');
    const itemDateArgentina = new Date(itemDateUTC.getTime() + argentinaOffset2 * 60 * 1000);
    const itemDateStr = itemDateArgentina.toISOString().slice(0, 10);
    return itemDateStr === todayStr;
});

// If no forecasts available for today, use tomorrow's forecasts
const forecastsToUse = todayForecasts.length > 0 ? todayForecasts : data.list.filter(item => {
    const itemDateUTC = new Date(item.dt_txt.replace(' ', 'T') + 'Z');
    const itemDateArgentina = new Date(itemDateUTC.getTime() + argentinaOffset2 * 60 * 1000);
    const itemDateStr = itemDateArgentina.toISOString().slice(0, 10);
    return itemDateStr === tomorrowStr;
});

const createTimeOfDayForecast = (item: ForecastListItem, period: 'MAÑANA' | 'TARDE' | 'NOCHE'): TimeOfDayForecast => {
    const conditionId = item.weather[0].id;
    const normalizedCondition = normalizeCondition(conditionId);
    
    // Determine day/night based on Argentina timezone hour, not API's pod
    const itemDateUTC = new Date(item.dt_txt.replace(' ', 'T') + 'Z');
    const argentinaOffset = -3 * 60; // UTC-3 in minutes
    const itemDateArgentina = new Date(itemDateUTC.getTime() + argentinaOffset * 60 * 1000);
    const argentinaHour = itemDateArgentina.getUTCHours();
    
    const dayOrNight = (argentinaHour >= 6 && argentinaHour < 20) ? 'day' : 'night';
    
    let iconFilename = normalizedCondition;
    if (normalizedCondition === 'clear' || normalizedCondition === 'partly_cloudy') {
        iconFilename = `${normalizedCondition}_${dayOrNight}`;
    }
    return {
        period,
        temp: Math.round(item.main.temp),
        icon: `${dayOrNight}/${iconFilename}.webm`,
        pop: formatPop(item.pop)
    };
};

// Helper function to get hour from forecast item in Argentina timezone
const getHour = (item: ForecastListItem): number => {
    const itemDateUTC = new Date(item.dt_txt.replace(' ', 'T') + 'Z');
    const argentinaOffset = -3 * 60; // UTC-3 in minutes
    const itemDateArgentina = new Date(itemDateUTC.getTime() + argentinaOffset * 60 * 1000);
    return itemDateArgentina.getUTCHours();
};

// Find forecasts for different times of day based on available data in ranges
const morningForecast = forecastsToUse.find(f => {
    const hour = getHour(f);
    return hour >= 6 && hour <= 11;
});

const afternoonForecast = forecastsToUse.find(f => {
    const hour = getHour(f);
    return hour >= 12 && hour <= 18;
});

const nightForecast = forecastsToUse.find(f => {
    const hour = getHour(f);
    return hour >= 19 && hour <= 23;
});

if (morningForecast) timeOfDayForecasts.push(createTimeOfDayForecast(morningForecast, 'MAÑANA'));
if (afternoonForecast) timeOfDayForecasts.push(createTimeOfDayForecast(afternoonForecast, 'TARDE'));
if (nightForecast) timeOfDayForecasts.push(createTimeOfDayForecast(nightForecast, 'NOCHE'));


    return {
        location: {
            name: data.city.name.toUpperCase(),
            subname: 'Chaco', // Placeholder as API doesn't return province
            lat: data.city.coord.lat,
            lon: data.city.coord.lon,
        },
        forecasts,
        currentWeather,
        timeOfDayForecasts,
    };
};

export const fetchWeatherForLocation = async (location: Location): Promise<ProcessedLocationData> => {
    const url = `${API_BASE_URL}?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric&lang=es`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 401) {
                 throw new Error(`HTTP error! status: ${response.status}. Check your API Key.`);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: OpenWeatherResponse = await response.json();
        const processedData = processWeatherData(data);
        
        // Generate Gemini summary
        const summary = await generateWeatherSummary(processedData.currentWeather, location.name);
        
        // Override API city name with our constant name for consistency
        processedData.location.name = location.name;
        processedData.location.subname = location.subname;
        
        return {
            ...processedData,
            currentWeatherSummary: summary,
        };
    } catch (error) {
        console.error(`Failed to fetch weather for ${location.name}:`, error);
        throw error;
    }
};