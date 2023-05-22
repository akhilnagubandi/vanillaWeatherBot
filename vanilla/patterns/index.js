const patternDict =[{
      pattern:'\\b(bye|exit|adios)\\b',
      intent: 'Exit'
},{
      pattern: '\\b(?<greeting>hi|hello|hey|hola)\\b',
      intent: 'Hello'
},{
      pattern: 'like\\sin\\s\\b(?<city>.+)',
      intent: 'CurrentWeather'
},{
      pattern: '\\b(?<weather>rain|rainy|sunny|cloudy|mist|foggy|drizzle|snow|snowy)\\b\\sin\\s\\b(?<city>[a-z]+[a-z]+?)\\b(?<time>day after tomorrow|tomorrow|today)$',
      intent: 'weatherForecast'
},{
      pattern:'\\b(?<weather>rain|rainy|sunny|cloudy|mist|foggy|drizzle|snow|snowy)\\b\\s\\b(?<time>day after tomorrow|tomorrow|today)\\sin\\s\\b(?<city>[a-z]+[a-z]+?)$',
      intent: 'weatherForecast'
}];
module.exports = patternDict;
