import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';


export const getCurrentWeather = async (cityName) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: cityName,
        appid: API_KEY,
        units: 'metric'  
      }
    });

    
    return {
      temp: Math.round(response.data.main.temp),
      condition: response.data.weather[0].main,
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      windSpeed: Math.round(response.data.wind.speed * 3.6), 
      icon: response.data.weather[0].icon
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    
    return {
      temp: 23,
      condition: 'Partly Cloudy',
      description: 'Unable to fetch weather',
      humidity: 65,
      windSpeed: 12
    };
  }
};


export const getWeatherForecast = async (cityName) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: cityName,
        appid: API_KEY,
        units: 'metric',
        cnt: 40  
      }
    });

    
    const dailyForecasts = [];
    const processedDates = new Set();

    response.data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateString = date.toDateString();
      
    
      const hour = date.getHours();
      if (!processedDates.has(dateString) && hour >= 11 && hour <= 13) {
        processedDates.add(dateString);
        dailyForecasts.push({
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          condition: getWeatherEmoji(item.weather[0].main),
          description: item.weather[0].description
        });
      }
    });

    return dailyForecasts.slice(0, 5);  
  } catch (error) {
    console.error('Error fetching forecast:', error);
    
    return [
      { day: 'Mon', high: 25, low: 18, condition: '☀️' },
      { day: 'Tue', high: 24, low: 16, condition: '⛅' },
      { day: 'Wed', high: 22, low: 15, condition: '🌧️' },
      { day: 'Thu', high: 23, low: 17, condition: '⛅' },
      { day: 'Fri', high: 26, low: 19, condition: '☀️' }
    ];
  }
};

function getWeatherEmoji(condition) {
  const emojiMap = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Drizzle': '🌦️',
    'Thunderstorm': '⛈️',
    'Snow': '🌨️',
    'Mist': '🌫️',
    'Fog': '🌫️',
    'Haze': '🌫️'
  };
  
  return emojiMap[condition] || '⛅';
}
