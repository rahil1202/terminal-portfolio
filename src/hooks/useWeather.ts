
import { useState, useCallback } from 'react';

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
}

export const useWeather = () => {
  const [isLoading, setIsLoading] = useState(false);

  const getWeather = useCallback(async (): Promise<string[]> => {
    setIsLoading(true);
    
    try {
      // Get user's location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      
      // Using OpenWeatherMap API (you'd need to add your API key)
      // For demo purposes, returning mock data
      const mockWeather: WeatherData = {
        location: 'Your Location',
        temperature: Math.floor(Math.random() * 30) + 5,
        description: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5
      };

      setIsLoading(false);
      
      return [
        '',
        '🌤️  WEATHER REPORT',
        '=================',
        '',
        `📍 Location: ${mockWeather.location}`,
        `🌡️  Temperature: ${mockWeather.temperature}°C`,
        `☁️  Conditions: ${mockWeather.description}`,
        `💧 Humidity: ${mockWeather.humidity}%`,
        `💨 Wind Speed: ${mockWeather.windSpeed} km/h`,
        `🕐 Updated: ${new Date().toLocaleTimeString()}`,
        ''
      ];
    } catch (error) {
      setIsLoading(false);
      return [
        '',
        '❌ Weather service unavailable',
        'Unable to fetch weather data. Please check location permissions.',
        ''
      ];
    }
  }, []);

  return { getWeather, isLoading };
};
