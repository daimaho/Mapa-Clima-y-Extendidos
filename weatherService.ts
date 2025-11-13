// Pseudocode representing the approach

// Assuming the file contains icon paths that need to be updated
function updateIconPaths(weatherData) {
  const updatedWeatherData = weatherData.map(data => {
    const { icon, ...otherData } = data;
    // Format icon paths with day/night prefixes
    const prefix = (data.isDay) ? 'day-' : 'night-';
    const newIconPath = `${prefix}${icon}`;
    return { ...otherData, icon: newIconPath };
  });
  return updatedWeatherData;
}

// Example usage
const weatherData = [{ icon: 'sunny', isDay: true }, { icon: 'moon', isDay: false }];
console.log(updateIconPaths(weatherData));