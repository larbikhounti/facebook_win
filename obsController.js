const OBSWebSocket = require("obs-websocket-js");
const chalk = require("chalk");
require('dotenv').config();
class obsController {
  obs;

  constructor(adress,password) {
    this.obs = new OBSWebSocket();
    this.address = adress
    this.password = password
  }
  // connect to obs
  async Connect(stream_url) {
    let result = false;
    await this.obs
      .connect({
        address: this.address ,
        password: this.password,
      })
      .then(async () => {
          console.log(chalk.green(`Success! We're connected & authenticated.`));
          if(await this.setStreamKey(stream_url).then(state=>state)){
            result = await this.startStreaming();
          }
         
        // this.restartStream();
      });
    return result;
  }

  /*
  //restart the stream
  restartStream() {
    this.obs.sendCallback(
      "TriggerHotkeyBySequence",
      {
        keyId: "OBS_KEY_F2",
      },
      (error) => {
        if (error !== null) {
        }
      }
    );
  }
  */
  
  //start streaming
  async startStreaming() {
    let isStreamStarted = false;

    await this.obs.send("StartStreaming").then((streaming) => {
      // if there is no errors
      if (streaming.status === "ok") {
        console.log(chalk.yellow("Stream Started "));
        //set is Stream Started to true
        isStreamStarted = !isStreamStarted;
      } else {
        isStreamStarted;
      }
    });
    return isStreamStarted;
  }

  // switching scenes  will restart the count down 
  switchScenes() {
    this.obs.sendCallback(
      "SetCurrentScene",
      {
        "scene-name": "secondary",
        
      },
      (error,data) => {
        if(error){
          console.log(error) 
        }else{
         let myInteval =  setInterval(() => {
            this.obs.sendCallback(
              "SetCurrentScene",
              {
                "scene-name": "primary",
                
              },
              (error,data) => {
                if(error){
                  console.log(error) 
                }
                
              }
            );
            clearInterval(myInteval);
          }, 400);
         
         

        }
        
      }
    );
  



  }
  // save stream url to obs
  async setStreamKey(stream_url){
   
    //SetStreamSettings
   let isStreamUrlSaved = false
    await this.obs.send("SetStreamSettings", { 
      settings: {
        bwtest: false,
        key: stream_url,
        server: 'rtmps://rtmp-api.facebook.com:443/rtmp/',
        service: 'Facebook Live'
      }

      }).then((streaming) => {
        
      // if there is no errors
      if (streaming.status === "ok") {
        //set is Stream key saved  to true
        console.log(streaming)
        isStreamUrlSaved = !isStreamUrlSaved;
      } else {
        isStreamUrlSaved;
      }
    }).catch(ex=>console.log(ex));
  }
}

module.exports = obsController;
