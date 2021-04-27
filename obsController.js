const OBSWebSocket = require("obs-websocket-js");
const chalk = require("chalk");

class obsController {
  obs;

  constructor(adress,password) {
    this.obs = new OBSWebSocket();
    this.address = adress
    this.password = password
  }
  // connect to obs
  async Connect() {
    let result = false;
    await this.obs
      .connect({
        address: this.address ,
        password: this.password,
      })
      .then(() => {
        console.log(chalk.green(`Success! We're connected & authenticated.`));

        // this.restartStream();
        result = this.startStreaming();
      });
    return result;
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
        }
      }
    );
  }
  //start streaming
  async startStreaming() {
    let isStreamStarted = false;

    await this.obs.send("StartStreaming").then((streaming) => {
      // if there is no errors
      if (streaming.status === "ok") {
        console.log(chalk.yellow("Stream Started "));

        isStreamStarted = !isStreamStarted;
      } else {
        isStreamStarted;
      }
    });
    return isStreamStarted;
  }
}

module.exports = obsController;
