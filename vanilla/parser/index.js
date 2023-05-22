'use strict'
const colours = require('colours');
const dictionary = require('./dictionary');
const moment = require('moment');
const getFeel = temp => {
  if (temp < 5){
     return 'shivering cold';
  } else if (temp >=5 && temp <15){
     return 'moderately cold';
  } else if (temp >=15 && temp <25){
     return 'warm';
  } else{
     return 'hot';
  }
}

const getPrefix = (conditionCode, tense = 'present') => {
  let findPrefix = dictionary[tense].find(item=>{
    if (item.codes.indexOf(Number(conditionCode))>-1){
       return true;
    }
  });
  return findPrefix.prefix || "";
}

const CurrentWeather = response => {
  if (response.location){
    const{
      location,condition,code,temp
    } = response;
    return `right now, ${getPrefix(code)} ${condition.toLowerCase()} in ${location}. It is ${getFeel(Number(temp))} at ${String(temp)} degree celcius`
  }
}

const getDate = day => {
  let dayStr = day.toLowerCase().trim();
  switch(dayStr){
    case 'tomorrow':
        return moment()
            .add(1,'d')
            .format('YYYY-MM-DD');
    case 'day after tomorrow':
        return moment()
            .add(2,'d')
            .format('YYYY-MM-DD');
    default:
        return moment()
            .format('YYYY-MM-DD');
    }
}

const forecastWeather = (response,data)=> {
  if (response.location) {
    let parseDate = getDate(data.time)
    let {location} = response;
    let {condition, code} = response.forecast.filter(i=> i.date === parseDate)[0];
    let regEx = new RegExp(data.weather,'i');
    let testConditions = regEx.test(condition);
    return `${testConditions?'Yes':'No'},${getPrefix(code,"future")} ${condition.toLowerCase()} ${data.time} in ${location}`;
  }
}
module.exports = {
  CurrentWeather,
  forecastWeather
}
