import * as React from 'react';
import { useState, useEffect } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import WeatherDisplay from './WeatherDisplay';

const API_KEY = '90c77ec3042549f5cc0b7aa750034457'
const UNITS = 'imperial';
const LANG = 'en';

export default function WeatherAPI(props) {
  const [weatherReport, setWeatherReport] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(null);

  useEffect(() => {
    //logic to call weather API
    const weatherURL = `http://api.openweathermap.org/data/2.5/weather?q=${props.city}&lang=${LANG}&appid=${API_KEY}&units=${UNITS}`;
    const devURL = '/api/weather';


    //modify this script so the request gets sent to the backend first
    //sends POST request to api/weather in backend with body as city: 
    // fetch(devURL, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify( {city: props.city}),
    // })
    // .then( response => response.json())
    // .then( data => {
    //   //check for statuscode - this is the object that we will get back from the backend
    //   if (data.statusCode !== 200) {
    //     setLoading(true);
    //   } else {
    //   setWeatherReport(data);
    //   console.log(weatherReport);
    //   setLoading(false);
    //   }
    // })
    // .catch( error => {
    //   console.log('Error: ', error);
    //   setError(error);
    //   setLoading(true);
    // })

    fetch(weatherURL)
    .then( response => response.json())
    .then( data => {
      //check for statuscode - this is the object that we will get back from the backend
      if (data.cod !== 200) {
        setLoading(true);
      } else {
      setWeatherReport(data);
      console.log(weatherReport);
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