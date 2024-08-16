import { Box, Paper, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import iconUrlFromCode from '../utils/iconUrlFromCode';
import toLocalTime from '../utils/toLocalTime';
import { WeatherData } from '../types/WeatherData';
import WeatherInfoBlock from '../components/WeatherInfoBlock/WeatherInfoBlock';
import HourlyForecast from '../components/HourlyForecast/HourlyForecast';
import { TailSpin } from 'react-loader-spinner';
import { LineChart } from '@mui/x-charts/LineChart';
import { HourlyWeatherResponds } from '../types/HourlyWeatherTypes';

export const CityDetails: React.FC = () => {
  const { city } = useParams();
  const xLabels = [
    '3 am',
    '6 am',
    '9 am',
    '12 pm',
    '3 pm',
    '6 pm',
    '9 pm',
    '12 am',
  ];
  const [cityDetails, setCityDetails] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [weatherForecast, setWeatherForecast] =
    useState<HourlyWeatherResponds | null>(null);
  const [temperatureForecast, setTemperatureForecast] = useState<number[]>([]);

  useEffect(() => {
    const fetchCityDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lat=${
            cityDetails?.coord.lat
          }&lon=${cityDetails?.coord.lon}&cnt=8&appid=${
            import.meta.env.VITE_WEATHER_APP_API_KEY
          }`,
        );
        setWeatherForecast(response.data);
        setTemperatureForecast(
          response.data.list.map(
            (item: { main: { temp: number } }) => +item.main.temp.toFixed(),
          ),
        );
      } catch (error) {
        console.error('Error fetching city details:', error);
        setWeatherForecast(null);
      }
    };

    fetchCityDetails();
  }, [city, cityDetails?.coord.lat, cityDetails?.coord.lon]);

  useEffect(() => {
    const fetchCityDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
            import.meta.env.VITE_WEATHER_APP_API_KEY
          }`,
        );
        setCityDetails(response.data);

        setTimeout(() => {
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching city details:', error);
        setCityDetails(null);
        setLoading(false);
      }
    };

    fetchCityDetails();
  }, [city]);

  if (loading || !cityDetails || !weatherForecast) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <TailSpin color="#3b4460" height={80} width={80} />
      </Box>
    );
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <Paper
        sx={{
          marginTop: '24px',
          p: '20px',
          display: 'flex',
          width: '100%',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '25px',
          minHeight: '375px',
        }}
        elevation={2}
      >
        <Box>
          <Box display="flex" alignItems="start">
            <Box>
              <img
                src={iconUrlFromCode(cityDetails.weather[0].icon)}
                alt="weather icon"
                width="115"
                height="115"
              />

              <Box display="flex" borderBottom="1px solid #D3D3D3">
                <Typography
                  fontSize="24px"
                  maxWidth="140px"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textTransform="capitalize"
                  marginRight={1}
                >
                  {cityDetails.name},
                </Typography>
                <Typography fontSize="24px">
                  {cityDetails.sys.country}
                </Typography>
              </Box>

              <Typography fontSize="48px">{`${cityDetails.main.temp.toFixed()}°C`}</Typography>

              <Box display="flex" columnGap="5px" color="black">
                <Typography>{`High: ${cityDetails.main.temp_max.toFixed()}°C`}</Typography>
                |
                <Typography>{`Low: ${cityDetails.main.temp_min.toFixed()}°C`}</Typography>
              </Box>
            </Box>
          </Box>

          <WeatherInfoBlock
            mt={2}
            humidity={cityDetails.main.humidity}
            speed={cityDetails.wind.speed}
            feels_like={cityDetails.main.feels_like}
          />
        </Box>

        <Box order={{ md: 0, xs: 3 }}>
          <Typography fontSize={18}>
            Local time:{' '}
            {`${toLocalTime(
              cityDetails.dt * 1000,
              cityDetails.timezone,
              'dddd, h:mm a',
            )}`}
          </Typography>
        </Box>

        <Box textAlign={{ sm: 'end', xs: 'start' }} order={{ md: 0, xs: 2 }}>
          <Typography fontSize={18}>Hourly Forecast</Typography>
          <HourlyForecast
            weatherForecast={weatherForecast}
            timezone={cityDetails.timezone}
          />
        </Box>
      </Paper>
      <div className="bg-gradient-to-r from-[#3b4460] to-[#556a77] animate-gradient-animation p-5 mt-10 rounded-2xl">
        <div className="text-2xl font-semibold text-white">
          Temperature forecast
        </div>
        <LineChart
          xAxis={[{ scaleType: 'point', data: xLabels }]}
          yAxis={[
            {
              scaleType: 'linear',
              min: 10,
              max: 40,
            },
          ]}
          series={[
            {
              curve: 'linear',
              data: temperatureForecast,
            },
          ]}
          width={1280}
          height={500}
          colors={['#FFF']}
          sx={{
            '& .MuiChartsAxis-left .MuiChartsAxis-tickLabel': {
              strokeWidth: '0.4',
              fill: '#FFF',
            },
            '& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel': {
              strokeWidth: '0.5',
              fill: '#FFF',
            },
            '& .MuiChartsAxis-bottom .MuiChartsAxis-line': {
              stroke: '#FFF',
              strokeWidth: 0.6,
            },
            '& .MuiChartsAxis-left .MuiChartsAxis-line': {
              stroke: '#FFF',
              strokeWidth: 0.6,
            },
          }}
        />
      </div>
    </div>
  );
};
