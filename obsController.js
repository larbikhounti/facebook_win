const OBSWebSocket = require("obs-websocket-js");
const chalk = require("chalk");

class obsController {
  obs;
  constructor() {
    this.obs = new OBSWebSocket();
  }
  // connect to obs
  Connect() {
    this.obs
      .connect({
        address: "localhost:4444",
        password: "admin",
      })
      .then(() => {
        console.log(chalk.green(`Success! We're connected & authenticated.`));
        this.startStreaming();
        // this.restartStream();
      });
  }
  //restart the stream
  restartStream() {
    this.obs.sendCallback(
      "TriggerHotkeyBySequence",
      {
        keyId: "OBS_KEY_F2",
      },
      (error) => {
        if (error !== null) {
          console.log(error);
        }
      }
    );
  }
  //start streaming
 async startStreaming() {
    
    // start streaming 
   this.obs.sendCallback("StartStreaming", (error) => {
        // if there is no errors
      if (error === null) {
        console.log(chalk.yellow("Stream Started "));
        console.log(chalk.yellow("Collecting Comments..."));
      }
      
    });
  
  }
}
module.exports = obsController;
