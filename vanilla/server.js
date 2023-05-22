'use strict'
const express = require('express'); //this creates an express instance that allows us to define routers listen to ports, serve responses
const config = require('./config');
const bodyParser = require('body-parser');
const FBeamer = require('./fbeamer');
const f = new FBeamer(config.fb); // fbeamer requires page acces token verfiy token to work so we are passing fb object from config folder
const matcher = require('./matcher');
const weather = require('./weather');
const { CurrentWeather, forecastWeather } = require('./parser')
//mailing system start





const server = express();
const PORT = process.env.PORT || 3000;

server.get('/', (req,res) => f.registerHook(req, res)); // route handler function that handles get type of requests '/' targets the root routers
// => (callback) request and response stream. the request stream contains the data it receives when a calling service sends a request to the server and response is to send an appropriate response
server.post('/',bodyParser.json({
  verify: f.verifySignature
}));
server.post('/',(req,res,next)=>{
  //messeges will be received here if the signature goes through
  //we will pass the messages to FBeamer for parsing
  return f.incoming(req,res, data =>{
    try {

      // if(data.content === 'hi there'){
      //
      //   await f.txt(data.sender,"hey from vennela!");
      //   await f.img(data.sender,'http://3.bp.blogspot.com/-dFd9Q1xqj4g/TpwITH5MdHI/AAAAAAAABhs/Vsjutj9fYsc/s1600/sit-moon-beam-serene.jpg')
      // }
      if(data.type === 'text'){
        matcher(data.content, async resp =>{
          try {


          switch(resp.intent){
            case 'Hello':
              await f.txt(data.sender,`${resp.entities.greeting} to you too`);
              break;
            case 'CurrentWeather':
              await f.txt(data.sender, 'let me check...');
              let cwData = await weather(resp.entities.city, 'current');
              let cwResult = CurrentWeather(cwData);
              await f.txt(data.sender,cwResult);
              break;
            case 'weatherForecast':
              await f.txt(data.sender,'let me check...');
              let wfData = await weather(resp.entities.city);
              let wfResult = forecastWeather(wfData,resp.entities);
              await f.txt(data.sender,wfResult);
              break;
            default: {
              await f.txt(data.sender, 'I am proud to say i dont know');
            }
          }
        } catch (e) {
          console.log(e);
        }
        });
      }
    } catch (e) {
      console.log(e);
    }
  });
  // return f.incoming(req,res, data =>{
  //   console.log(data);
  // });
});
server.listen(PORT,() => console.log(`Bot service is running on ${PORT}`)); //listens to the port and gives appropriate callback
