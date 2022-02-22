import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import WeatherAPI from './weatherAPI';
import Typography from '@mui/material/Typography';


export default function Weather() {
  const [city, setCity] = React.useState(null);

  return (
    <Grid alignItems="center" container>
      <Card>
        <CardContent>
          <Typography paragraph>
              Weather Report
          </Typography>
          <TextField
            autoFocus
            label="City Name"
            onChange={ (event) => setCity(event.target.value)}
            />
            <WeatherAPI city={city} />
        </CardContent>
      </Card>
    </Grid>
  )
}
