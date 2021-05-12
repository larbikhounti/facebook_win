const OBSWebSocket = require("obs-websocket-js");
const chalk = require("chalk");
const fs = require("fs");
const fetch = require("node-fetch");
const { stringify } = require("query-string");
const globalSettings = require("./globalSettings");
require("dotenv").config();
class obsController {
  obs;
  imageCount = 0;
  interval0;
  interval1;
  interval2;
  interval3;
  thereIsaWinner = false;

  constructor(adress, password) {
    this.obs = new OBSWebSocket();
    this.address = adress;
    this.password = password;
  }
  // connect to obs
  async Connect(stream_url) {
    console.log(chalk.yellow("connecting to obs... "));
    let result = false;
    await this.obs
      .connect({
        address: this.address,
        password: this.password,
      })
      .then(async () => {
        console.log(chalk.green(`obs connected.`));
        if (await this.setStreamKey(stream_url).then((state) => state)) {
          result = await this.startStreaming();
        }

        // this.restartStream();
      })
      .catch((ex) => {
        console.log(chalk.bgRed(ex.description));
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
    console.log(chalk.yellow("starting live stream..."));
    await this.obs.send("StartStreaming").then((streaming) => {
      // if there is no errors
      if (streaming.status === "ok") {
        console.log(chalk.green("Stream Started."));
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
      (error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log(chalk.greenBright("CountDown Changed to start "));
          let myInteval = setInterval(() => {
            this.obs.sendCallback(
              "SetCurrentScene",
              {
                "scene-name": "primary",
              },
              (error, data) => {
                if (data.state === "ok") {
                }
                if (error) {
                  console.log(error);
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
  async setStreamKey(stream_url) {
    console.log(chalk.bgGreen("setting obs stream key ..."));
    //SetStreamSettings
    let isStreamUrlSaved = false;
    await this.obs
      .send("SetStreamSettings", {
        settings: {
          bwtest: false,
          key: stream_url,
          server: "rtmps://rtmp-api.facebook.com:443/rtmp/",
          service: "Facebook Live",
        },
      })
      .then((streaming) => {
        // if there is no errors
        if (streaming.status === "ok") {
          //set is Stream key saved  to true
          console.log(chalk.green("obs stream key is set."));
          isStreamUrlSaved = !isStreamUrlSaved;
        } else {
          isStreamUrlSaved;
        }
      })
      .catch((ex) => console.log(ex));
    return isStreamUrlSaved;
  }
  async setTheImage() {
    let isImageSaved = false;

    await this.obs
      .send("SetSourceSettings", {
        sourceName: `profile_pic${this.imageCount}`,
        sourceSettings: {
          css: "",
          fps_custom: false,
          height: 300,
          reroute_audio: false,
          url: process.cwd() + `/profile_pic/${this.imageCount}.jfif`,
          width: 300,
        },
      })
      .then(async (result) => {
        // if there is no errors
        if (result.status === "ok") {
          console.log(chalk.green("obs image is set."));
          isImageSaved = !isImageSaved;
        } else {
          isImageSaved;
        }
      })
      .catch((ex) => console.log(ex));
    return isImageSaved;
  }

  async downloadAndSaveit(image_url, user_name) {
    let ctx = this;
    const response = await fetch(image_url);
    const buffer = await response.buffer();
    switch (this.imageCount) {
      case 0:
        ctx.setUserName(user_name);
        this.imageCount++;
        return fs.writeFile(`./profile_pic/0.jfif`, buffer, async function () {
          return await ctx.setTheImage().then(() => {
            ctx.WinnerCountDown(0);
          });
        });

      case 1:
        ctx.setUserName(user_name);
        this.imageCount++;
        return fs.writeFile(`./profile_pic/1.jfif`, buffer, async function () {
          return await ctx.setTheImage().then(() => {
            ctx.WinnerCountDown(1);
          });
        });

      case 2:
        ctx.setUserName(user_name);
        this.imageCount++;
        return fs.writeFile(`./profile_pic/2.jfif`, buffer, async function () {
          return await ctx.setTheImage().then(() => {
            ctx.WinnerCountDown(2);
          });
        });

      case 3:
        ctx.setUserName(user_name);
        this.imageCount = 0;
        return fs.writeFile(`./profile_pic/3.jfif`, buffer, async function () {
          return await ctx.setTheImage().then(() => {
            ctx.WinnerCountDown(3);
          });
        });

      default:
        break;
    }
  }
  setUserName(user_name) {
    this.obs
      .send("SetSourceSettings", {
        sourceName: `name${this.imageCount}`,
        sourceSettings: { text: user_name },
      })
      .then((res) => console.log(res));
  }
  setUserCountDown(userCount, counttext) {
    this.obs
      .send("SetSourceSettings", {
        sourceName: `countdown${counttext}`,
        sourceSettings: { text: userCount.toString() },
      })
      .then((res) => console.log(res));
  }
  // set the count down on user profiles
  WinnerCountDown(position) {
    let ctx = this;
    let count0 = parseInt(process.env.COUNT0);
    let count1 = parseInt(process.env.COUNT1);
    let count2 = parseInt(process.env.COUNT2);
    let count3 = parseInt(process.env.COUNT3);
    if (this.thereIsaWinner == false) {
      switch (position) {
        case 0:
          clearInterval(this.interval0);
          this.interval0 = setInterval(function () {
            count0--;
            if (ctx.thereIsaWinner === true) {
              clearInterval(ctx.interval0);
            } else {
              ctx.setUserCountDown(count0, 0);
              if (count0 <= 0) {
                ctx.thereIsaWinner = true;
                //count0 = 60
                ctx.setUserCountDown("winner", 0);
                // will stop the countdown
                clearInterval(ctx.interval0);
                //will find the winner and display it
                ctx.getSourceSettings(0);
              }
            }
          }, 1000);

          break;
        case 1:
          clearInterval(this.interval1);
          this.interval1 = setInterval(function () {
            count1--;
            if (ctx.thereIsaWinner === true) {
              clearInterval(ctx.interval1);
            } else {
              ctx.setUserCountDown(count1, 1);
              if (count1 <= 0) {
                ctx.thereIsaWinner = true;
                //count0 = 60
                ctx.setUserCountDown("winner", 1);
                clearInterval(ctx.interval1);
                 //will find the winner and display it
                 ctx.getSourceSettings(1);
              }
            }
          }, 1000);

          break;
        case 2:
          clearInterval(this.interval2);
          this.interval2 = setInterval(function () {
            count2--;
            if (ctx.thereIsaWinner === true) {
              clearInterval(ctx.interval2);
              console.log("interval 2 stoped");
            } else {
              ctx.setUserCountDown(count2, 2);
              if (count2 <= 0) {
                ctx.thereIsaWinner = true;
                //count2 = 60
                ctx.setUserCountDown("winner", 2);
                clearInterval(ctx.interval2);
                  //will find the winner and display it
                  ctx.getSourceSettings(2);
              }
            }
          }, 1000);

          break;
        case 3:
          clearInterval(this.interval3);
          this.interval3 = setInterval(function () {
            count3--;
            if (ctx.thereIsaWinner === true) {
              clearInterval(ctx.interval3);
              console.log("interval 3 stoped");
            } else {
              ctx.setUserCountDown(count3, 3);
              if (count3 <= 0) {
                ctx.thereIsaWinner = true;
                //count3 = 60
                ctx.setUserCountDown("winner", 3);
                clearInterval(ctx.interval3);
                  //will find the winner and display it
                  ctx.getSourceSettings(3);
                
              }
            }
          }, 1000);
          break;

        default:
          break;
      }
    }
  }
  // show the winner
  SwitchSceneAndSetTheWinner(index,user_name) {
 
    this.obs.sendCallback(
      "SetCurrentScene",
      {
        "scene-name": "winner",
      },
      (error, data) => {
        if (data.status === "ok") {
          this.setWinnerNameAndProfilePic(user_name,index)
        }
        if (error) {
          console.log(error);
        }
      }
    );

  }
  setWinnerNameAndProfilePic(user_name,image_index) {
    this.obs
      .send("SetSourceSettings", {
        sourceName: `winnername`,
        sourceSettings: { text: user_name },
      })
      .then((res) => {
        if (res.status == "ok") {
          this.setWinnerProfilePic(image_index)
        }
      }).catch(ex=>console.log(ex));
  }
async  setWinnerProfilePic(image_index){
    await this.obs
      .send("SetSourceSettings", {
        sourceName: `profile_pic`,
        sourceSettings: {
          css: "",
          fps_custom: false,
          height: 300,
          reroute_audio: false,
          url: process.cwd() + `/profile_pic/${image_index}.jfif`,
          width: 300,
        },
      })
      .then(async (result) => {
        // if there is no errors
        if (result.status === "ok") {
          console.log(chalk.green("winner profile pic is set"));
         
        } 
      })
      .catch((ex) => console.log(ex));
  }
 async getSourceSettings(index){
   globalSettings.isCommentsAllowed = false;
  return await this.obs
    .send("GetSourceSettings", {
      sourceName: `name${index}`
    })
    .then((res) => {
      if (res.status== "ok") {
        let user_name = res.sourceSettings.text;
        this.SwitchSceneAndSetTheWinner(index,user_name)
      //  this.SwitchSceneAndSetTheWinner(index,)
     // console.log(res.sourceSettings.text)
      }
    }).catch(ex=>console.log(ex));

  }
} //end of class

module.exports = obsController;
