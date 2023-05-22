'use strict'

const crypto = require('crypto');
const request = require('request');
const apiVersion ='v2.8';
class FBeamer {
  constructor({pageAccessToken,verifyToken, appSecret}) {
    try {
      if (pageAccessToken && verifyToken) {
        this.pageAccessToken=pageAccessToken;
        this.verifyToken=verifyToken;
        this.appSecret=appSecret;
      }else{
        throw "one or more credentials are missing:";
      }
    } catch (e) {
      console.log(e);
    }
  }

  registerHook(req,res){
    const params = req.query;
    const mode = params['hub.mode'],
    token = params['hub.verify_token'],
    challenge = params['hub.challenge'];
    // mode == subscribe and token == verifyToken, then send back challenge
    try {
      if((mode&&token)&&(mode==='subscribe'&&token===this.verifyToken)){
        console.log('webhook registered');
        return res.send(challenge);
      }else {
        throw 'could not register webhook!';
        return res.sendStatus(200);
      }
    } catch (e) {
      console.log(e);
    }
  }

  verifySignature(req,res,buf) {
    return(req,res,buf) =>{
      if(req.method === POST){
        try {
          let signature =req.headers['x-hub-signature'];
          if(!signature){
            throw "signature not received"
          }else {
            let hash = crypto.createHmac('sha1',this.appSecret).update(buf,'utf-8');
            if(hash.digest('hex')!==signature.split("=")[1]){
              throw 'invalid signature'
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
  incoming(req,res,cb){
    res.sendStatus(200);
    if (req.body.object === 'page' && req.body.entry) {
      let data = req.body;
      // console.log(data);
      data.entry.forEach(pageObj => {
        if(pageObj.messaging){
          pageObj.messaging.forEach(messageObj => {
            if(messageObj.postback){

            }else{
              return cb(this.messageHandler(messageObj));
              // return cb(messageObj);
            }
          })
        }
      });
    }
  }
  messageHandler(obj){
    let sender = obj.sender.id;
    let message = obj.message;

    if(message.text){
      let obj ={
        sender,
        type:'text',
        content: message.text
      }
      return obj;
    }
  }
  sendMessage(payload) {
    // console.log(payload)
      return new Promise((resolve, reject) => {
        // console.log(this.pageAccessToken);
        request({
          uri: `https://graph.facebook.com/v2.6/me/messages`,
          qs: {
            access_token: this.pageAccessToken
          },
          method: 'POST',
          json: payload
        }, (error, response, body) => {
          if (!error && response.statusCode === 200) {
            // console.log("hai true");
            resolve({
              mid: body.message_id
            });
          } else {
            // console.log(response.statusCode);
            // console.log("hai false");
            reject(error);
          }
        });
      });
    }
   txt(id, text,messaging_type = 'RESPONSE'){

       let obj = {
         messaging_type,
         recipient:{
           id
         },
         message:{
           text
         }
       }
    // console.log(obj);



     return this.sendMessage(obj);

   }


   img(id,url,messaging_type = 'RESPONSE'){

        let obj = {
          messaging_type,
          recipient:{
            id
          },
          message:{
            attachment:{
              type: 'image',
              payload: {
                url
              }
            }
          }
        }
        return this.sendMessage(obj);
   }
}

module.exports = FBeamer;
