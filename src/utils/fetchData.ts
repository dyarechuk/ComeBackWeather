import axios from 'axios';

export const getWeatherInfo = (city: string) => {
  const apiKey = import.meta.env.VITE_WEATHER_APP_API_KEY;
  return axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
    params: {
      q: city,
      appid: apiKey,
      units: 'metric',
    },
  });
};
