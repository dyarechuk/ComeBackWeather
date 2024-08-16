import { Box, Typography, Paper } from '@mui/material';
import iconUrlFromCode from '../../utils/iconUrlFromCode';

type WeatherByTimeBlockProps = {
  time: string;
  icon: string;
  temp: number;
  details: string;
};

const WeatherByTimeBlock = ({
  time,
  icon,
  temp,
  details,
}: WeatherByTimeBlockProps): JSX.Element => {
  return (
    <Paper
      sx={{
        maxWidth: '100px',
        width: '100%',
        height: '105px',
        background: 'transparent',
        textAlign: 'center',
        p: '10px',
        cursor: 'pointer',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.4)',
        },
      }}
    >
      <Typography>{time}</Typography>
      <Box display="flex" alignItems="center">
        <img
          src={iconUrlFromCode(icon)}
          alt="weather icon"
          width="40"
          height="40"
        />
        <Typography>{`${temp.toFixed()}°C`}</Typography>
      </Box>
      <Typography fontSize={14}>{details}</Typography>
    </Paper>
  );
};

export default WeatherByTimeBlock;
