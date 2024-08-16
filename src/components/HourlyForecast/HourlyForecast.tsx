import { Box } from '@mui/material';
import toLocalTime from '../../utils/toLocalTime';
import { HourlyWeatherResponds } from '../../types/HourlyWeatherTypes';
import WeatherByTimeBlock from '../WeatherByTimeBlock/WeatherByTimeBlock';

type THourlyForecastProps = {
  weatherForecast: HourlyWeatherResponds;
  timezone: number;
};

export default function HourlyForecast({
  weatherForecast,
  timezone,
}: THourlyForecastProps): JSX.Element {
  if (!weatherForecast) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      display="flex"
      gap="10px"
      maxWidth="420px"
      minWidth="210px"
      width="100%"
      flexWrap="wrap"
      justifyContent={{ sm: 'flex-end', xs: 'flex-start' }}
    >
      {weatherForecast.list.map((weather) => (
        <WeatherByTimeBlock
          key={weather.dt}
          time={toLocalTime(weather.dt * 1000, timezone, 'h:mm a')}
          icon={weather.weather[0].icon}
          temp={weather.main.temp}
          details={weather.weather[0].main}
        />
      ))}
    </Box>
  );
}
