'use strict'
const axios = require('axios');
const apiKey ='1003c1176bb94c48a2393827192201'

const formatData = data => {
  return {
    location: `${data.location.name},${data.location.country}`,
    temp: data.current.temp_c,
    condition: data.current.condition.text,
    code: data.current.condition.code,
    forecast: data.forecast.forecastday.map(day=>{
      return {
        date: day.date,
        code: day.day.condition.code,
        condition: day.day.condition.text
      }
    })
  }
}

const getWeather = location =>{
    return new Promise(async (resolve,reject)=>{
      try{
          const weatherConditions = await axios.get(
            'https://api.apixu.com/v1/forecast.json',
            {
                params: {
                    key: apiKey,
                    q: location,
                    days: 3
                }
            });
            resolve(formatData(weatherConditions.data));
      }catch (error) {
          reject(error);
      }
    });
}
module.exports = getWeather;
