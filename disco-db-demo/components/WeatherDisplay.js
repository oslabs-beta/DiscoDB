import * as React from 'react';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';

export default function WeatherDisplay(props) {
  const weatherReport = props.weatherReport;
  const weatherMain = weatherReport.weather[0].main;
  const weatherDescription = weatherReport.weather[0].description;
  const temp = weatherReport.main.temp;
  const humidity = weatherReport.main.humidity;
  const wind = weatherReport.wind.speed;
  const country = weatherReport.sys.country;
  const city = weatherReport.name;

  return (
    <div>
      <CardContent>
        <Box display="flex" flexDirection="row">
          <Box p={1}>
            <Typography variant="h3" color="textPrimary">
              {city}, {country}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardContent>
        <Box display="flex">
          <Box p={0}>
            <Typography variant="h4" color="textPrimary">
              Temp: {temp}
              <span>&#176;</span>
              {"F"}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardContent>
        <Box display="flex">
          <Box p={0}>
            <Typography variant="h6" color="textSecondary">
              {weatherDescription}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardContent>
        <Box display="flex" flexDirection="row">
          <Box p={1}>
            <Typography variant="h6" color="textPrimary">
              Humidity: {humidity} %
            </Typography>
          </Box>
          <Box p={1}>
            <Typography variant="h6" color="textPrimary">
              Wind: {wind} mph
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </div>
  )
}