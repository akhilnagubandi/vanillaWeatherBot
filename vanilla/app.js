'use strict'
const Readline = require('readline');
const rl =Readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});
const matcher = require('./matcher');
const weather = require('./weather');
const { CurrentWeather, forecastWeather } = require('./parser')

rl.setPrompt('>:// ');
rl.prompt();
rl.on('line',reply =>{
    matcher(reply,data =>{
      // console.log(`${data.intent}`);
      switch(data.intent){
        case 'Hello':
            console.log(`${data.entities.greeting} to you too`);
            rl.prompt();
            break;
        case 'Exit':
            console.log('have a great day');
            // process.exit()
            rl.prompt();
            break;


        case 'CurrentWeather':
            console.log('checking weather for '+`${data.entities.city}....`);
            weather(data.entities.city)
            // .then(response => console.log(response))
              .then(response => {
              let parseResult = CurrentWeather(response);
              console.log(parseResult);
              rl.prompt();
              })
              .catch(error => {
                console.log(error);
                console.log("there seems to an error in connecting service");
              });
            rl.prompt();
            break;

        case 'weatherForecast':
            console.log('Let me check...');
            weather(data.entities.city)
              .then(response => {
              let parseResult = forecastWeather(response, data.entities);
              console.log(parseResult);
              rl.prompt();
              })
              .catch(error => {
                console.log(error);
                console.log("there seems to an error in connecting service");
              });
              rl.prompt();
              break;
        default: {
            console.log("I'm proud to say. I dont know");
            rl.prompt();
        }

      }
    });
});
