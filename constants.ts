import { Location } from './types';

// --- ¡ACCIÓN REQUERIDA! ---
// --- ¡ACCIÓN REQUERIDA! ---
// --- ¡ACCIÓN REQUERIDA! ---
//
// Reemplaza el texto "REPLACE_WITH_YOUR_API_KEY" con tu propia API key de OpenWeatherMap.
// El valor actual es solo un placeholder y NO FUNCIONARÁ.
//
// CÓMO OBTENER UNA API KEY GRATIS:
// 1. Ve a https://openweathermap.org/appid
// 2. Crea una cuenta gratuita.
// 3. Busca la sección "API keys" en tu perfil.
// 4. Copia tu clave (un texto largo de letras y números) y pégala aquí abajo.
//
// Ejemplo: export const API_KEY = "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6";
//
// Fix: Add a string type annotation to API_KEY to prevent TypeScript from inferring a narrow literal type. This resolves a type error in App.tsx where API_KEY is compared to a placeholder string.
export const API_KEY: string = "4fa0bddeed9ab169591bb11fbe01d655";
export const API_BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

export const LOCATIONS: Location[] = [
  { name: "RESISTENCIA", subname: "Chaco", lat: -27.45186, lon: -58.98555 },
  { name: "TACO POZO", subname: "Chaco", lat: -25.61587, lon: -63.26795 },
  { name: "JUAN JOSÉ CASTELLI", subname: "Chaco", lat: -25.94729, lon: -60.62034 },
  { name: "VILLA ÁNGELA", subname: "Chaco", lat: -27.57633, lon: -60.71179 },
  { name: "GRAL. JOSÉ DE SAN MARTÍN", subname: "Chaco", lat: -26.53798, lon: -59.34202 },
  { name: "PCIA. ROQUE SÁENZ PEÑA", subname: "Chaco", lat: -26.80044, lon: -60.43123 },
  { name: "CHARATA", subname: "Chaco", lat: -27.2135, lon: -61.1895 },
  { name: "GANCEDO", subname: "Chaco", lat: -27.4875, lon: -61.6749 },
  { name: "CHARADAI", subname: "Chaco", lat: -27.6713, lon: -59.8821 },
];

export const MAP_DISPLAY_LOCATIONS = [
  { name: "TACO POZO", shortName: "TACO POZO", pos: { top: '25%', left: '26%' } },
  { name: "JUAN JOSÉ CASTELLI", shortName: "J.J. CASTELLI", pos: { top: '24%', left: '44%' } },
  { name: "GANCEDO", shortName: "GANCEDO", pos: { top: '59%', left: '38%' } },
  { name: "CHARATA", shortName: "CHARATA", pos: { top: '49%', left: '46%' } },
  { name: "VILLA ÁNGELA", shortName: "VILLA ANGELA", pos: { top: '71%', left: '48%' } },
  { name: "PCIA. ROQUE SÁENZ PEÑA", shortName: "SAENZ PEÑA", pos: { top: '45%', left: '54%' } },
  { name: "GRAL. JOSÉ DE SAN MARTÍN", shortName: "SAN MARTIN", pos: { top: '43%', left: '64%' } },
  { name: "CHARADAI", shortName: "CHARADAI", pos: { top: '67%', left: '58%' } },
];


export const WEATHER_CONDITION_MAP: { [key: number]: string } = {
  // Thunderstorm
  200: 'storm', 201: 'storm', 202: 'storm', 210: 'storm', 211: 'storm',
  212: 'storm', 221: 'storm', 230: 'storm', 231: 'storm', 232: 'storm',
  // Drizzle
  300: 'drizzle', 301: 'drizzle', 302: 'drizzle', 310: 'drizzle', 311: 'drizzle',
  312: 'drizzle', 313: 'drizzle', 314: 'drizzle', 321: 'drizzle',
  // Rain
  500: 'rain', 501: 'rain', 502: 'rain', 503: 'rain', 504: 'rain',
  511: 'rain', 520: 'rain', 521: 'rain', 522: 'rain', 531: 'rain',
  // Snow (mapped to rain as per simplicity)
  600: 'rain', 601: 'rain', 602: 'rain', 611: 'rain', 612: 'rain',
  613: 'rain', 615: 'rain', 616: 'rain', 620: 'rain', 621: 'rain', 622: 'rain',
  // Atmosphere
  701: 'fog', 711: 'fog', 721: 'fog', 731: 'fog', 741: 'fog',
  751: 'fog', 761: 'fog', 762: 'fog', 771: 'wind', 781: 'wind',
  // Clear
  800: 'clear',
  // Clouds
  801: 'partly_cloudy', 802: 'cloudy', 803: 'cloudy', 804: 'cloudy',
};

export const CONDITION_PRIORITY: { [key: string]: number } = {
  storm: 8,
  rain: 7,
  drizzle: 6,
  wind: 5,
  fog: 4,
  cloudy: 3,
  partly_cloudy: 2,
  clear: 1,
};

export const CONDITION_TEXT_MAP_ES: { [key: string]: string } = {
    storm: 'Tormenta',
    rain: 'Lluvia',
    drizzle: 'Llovizna',
    wind: 'Viento',
    fog: 'Niebla',
    cloudy: 'Mayormente nublado',
    partly_cloudy: 'Parcialmente nublado',
    clear: 'Despejado',
};

export const BACKGROUND_VIDEO_URL = '/bg.webm';

// --- INSTRUCCIONES PARA ÍCONOS ANIMADOS (.webm) ---
//
// Para que los íconos del clima se muestren correctamente, debes crear una
// carpeta `icons` en la raíz de tu proyecto, y dentro de ella, dos
// subcarpetas: `day` y `night`.
//
// NOMBRES DE ARCHIVO ESPECÍFICOS:
// - Para cielo despejado y parcialmente nublado, usa nombres distintos para día y noche:
//   - `clear_day.webm` y `clear_night.webm`
//   - `partly_cloudy_day.webm` y `partly_cloudy_night.webm`
// - Para el resto de condiciones, el nombre es el mismo para día y noche (ej: `rain.webm`).
//
// ESTRUCTURA DE CARPETAS REQUERIDA:
// └─ / (Carpeta raíz de tu proyecto)
//    ├─ index.html
//    └─ /icons
//       ├─ /day
//       │   ├─ clear_day.webm
//       │   ├─ partly_cloudy_day.webm
//       │   ├─ cloudy.webm
//       │   ├─ rain.webm
//       │   ├─ ... (etc.)
//       └─ /night
//           ├─ clear_night.webm
//           ├─ partly_cloudy_night.webm
//           ├─ cloudy.webm
//           ├─ rain.webm
//           └─ ... (etc.)
//
// IMPORTANTE:
// - Los íconos que son iguales para día y noche (como `rain.webm` o `cloudy.webm`)
//   deben estar presentes en AMBAS carpetas (`day` y `night`).
//
export const ICON_PATH = '/icons/'; // e.g., /icons/day/clear_day.webm