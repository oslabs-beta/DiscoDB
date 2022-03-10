import * as React from 'react';
import { useState, useEffect } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import WeatherDisplay from './WeatherDisplay';

export default function WeatherAPI(props) {
  const [weatherReport, setWeatherReport] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(null);

  useEffect(() => {
     const devURL = '/api/weather';

    //sends POST request to api/weather in backend with body as city: 
    fetch(devURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( {city: props.city}),
    })
    .then( response => response.json())
    .then( data => {
      //check for statuscode - this is the object that we will get back from the backend
      if (data.statusCode !== 200) {
        setLoading(true);
      } else {
      setWeatherReport(data.data);
      setLoading(false);
      }
    })
    .catch( error => {
      console.log('Error: ', error);
      setError(error);
      setLoading(true);
    })
    
  }, [props.city])

  if(isLoading) {
    if(props.city) {
      return (
        <div>
          <LinearProgress />
        </div>
      )
    }
    else return null;
  } else {
  return(
    <WeatherDisplay weatherReport={weatherReport} />
  )
  }
}