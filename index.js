const obsController = require("./obsController");
const EventSource = require("eventsource");
const chalk = require("chalk");
require("dotenv").config();
const facebookAuth = require("./facebookAuth");
const FB = new facebookAuth();
const express = require("express");
const app = express();
app.set("view engine", "ejs");
const {
  startLiveVideo,
  privacies,
  getUserPicture,
} = require("./facebookVideoLiveConroller");
const globalSettings = require("./globalSettings");
// create instance of OBS Controller and passing adress and password of obs socket
const myController = new obsController(
  process.env.ADRESS,
  process.env.PASSWORD
);


// start live streaming on facebook and get post id and stream url
async function startLiveVideoStreaming() {
  let data = {
    title: "test",
    description: "this is a test",
    privacy: privacies.public,
    accessToken: process.env.ACCESS_TOKEN,
  };
  let isLiveStremingOnFacebookStrated = false;
  let { id, secure_stream_url } = await startLiveVideo(data).then(
    (videoData) => videoData
  );

  if (id) {
    process.env.VIDEO_ID = id;
    process.env.STREAM_URL = secure_stream_url;
    isLiveStremingOnFacebookStrated = true;
  }
  return isLiveStremingOnFacebookStrated;
}

app.get("/authenticate/facebook/", (req, res) => {
  //generate access tokken
  FB.getAccessTokenFromCode(req.query.code).then(async (state) => {
    // if the state is "true" that means we got the access token
    if (state) {
      if (
        await startLiveVideoStreaming().then((isLiveStarted) => isLiveStarted)
      ) {
        connectAndStartStreaming(process.env.STREAM_URL);
        res.render("success.ejs");
      }
    }
  });
});
// starting  server on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  console.log(chalk.yellow("waiting for facebook permission ..."));
  // get user permissions
  FB.getUserpermissions();
});

function connectAndStartStreaming(stream_url) {
  let ctx = this;
  // setting token and video id
  let access_token = process.env.ACCESS_TOKEN;
  let video_id = process.env.VIDEO_ID;
  let source = new EventSource(
    "https://streaming-graph.facebook.com/" +
      video_id +
      "/live_comments?access_token=" +
      access_token +
      "&comment_rate=one_per_two_seconds&fields=from{name,id},message"
  );

  // connecting to obs and starting the stream
  
  myController.Connect(stream_url).then((state) => {
    
    if (state) {
      if(globalSettings.isLiveJustStared=== false){
        let interval = setInterval(function () {
          myController.getSourceSettingsForStartingCountDown().then(res=>{
            if(res.sourceSettings.text === "start"){
              globalSettings.isCommentsAllowed = true;
              myController.switchToPrimary();
              source.onmessage = async function (newComment) {
              
                console.log("listenning to comments");
                // if there is a new comment restart countDown
                if (newComment) {
                  // if user is allowed to comment
                  if (globalSettings.isCommentsAllowed) {
                    // myController.switchScenes() // restart countDown
          
                    let comment = JSON.parse(newComment.data);
                    // get the user picure url
                    let myImageResult = await getUserPicture(comment.from.id).then(
                      (res) => res
                    );
                    //console.log(myImageResult.data.url);
                    await myController
                      .downloadAndSaveit(myImageResult.data.url, comment.from.name)
                      .then((res) => {
                        myController.switchScenes();
                      });
                  }
                }
              };
              clearInterval(interval)
              
            }else{
              console.log(res)
            }
          })
          
        }, 1000);
      }
    }
  });
}

