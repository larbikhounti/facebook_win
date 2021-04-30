const obsController = require("./obsController");
const EventSource = require("eventsource");
require("dotenv").config();
const facebookAuth = require("./facebookAuth");
const FB = new facebookAuth();
const express = require("express");
const app = express();
const {startLiveVideo,privacies} = require("./VideoLiveConroller");
// create instance of OBS Controller and passing adress and password of obs socket
const myController = new obsController(
  process.env.ADRESS,
  process.env.PASSWORD
);


// start live streaming on facebook and get post id and stream url
async function startLiveVideoStreaming() {
  let data = {
    title : "test",
    description : "this is a test",
    privacy: privacies.friends,
    accessToken : process.env.ACCESS_TOKEN
  
  }
  let isLiveStremingOnFacebookStrated = false;
  let {id,secure_stream_url} = await startLiveVideo(data).then(videoData=>videoData);

  if(id){
    process.env.VIDEO_ID = id
    process.env.STREAM_URL = secure_stream_url
    isLiveStremingOnFacebookStrated = true
  }
  console.log("wjy why why 2"+secure_stream_url)
  return isLiveStremingOnFacebookStrated
}




app.get("/authenticate/facebook/", (req, res) => {
  //generate access tokken
  FB.getAccessTokenFromCode(req.query.code).then( async(state) => {
    // if the state is "true" that means we got the access token
    if (state) {
      if(await startLiveVideoStreaming().then(isLiveStarted=>isLiveStarted)){
          connectAndStartStreaming(process.env.STREAM_URL); 
      }
      res.send("access token ok");
    }
  });
  
});
// starting  server on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  // get user permissions
  FB.getUserpermissions();
});


function connectAndStartStreaming(stream_url) {
  // setting token and video id
let access_token = process.env.ACCESS_TOKEN
let video_id = process.env.VIDEO_ID
let source = new EventSource("https://streaming-graph.facebook.com/" +video_id+"/live_comments?access_token=" +access_token+"&comment_rate=one_per_two_seconds&fields=from{name,id},message"
);

// connecting to obs and starting the stream

myController.Connect(stream_url).then((state) => {
  if (state) {
      // if stream started listen for new comments
    source.onmessage = function (event) {
      console.log(event);
      // if there is a comment restart countDown
      myController.switchScenes() // restart countDown
    }
  }else{
      console.log(state)
  }
  
});
}





