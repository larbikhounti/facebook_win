const obsController = require("./obsController");
const EventSource = require("eventsource");
require('dotenv').config();
// create instance of obs Controller and passing adress and password of obs socket
const myController = new obsController(process.env.ADRESS,process.env.PASSWORD);


// setting token and video id
let access_token = process.env.ACCESS_TOKEN
let video_id = process.env.VIDEO_ID
let source = new EventSource("https://streaming-graph.facebook.com/" +video_id+"/live_comments?access_token=" +access_token+"&comment_rate=one_per_two_seconds&fields=from{name,id},message"
);


// connecting to obs and starting the stream
myController.Connect().then((state) => {
  if (state) {
      // if stream started listen to comments
    source.onmessage = function (event) {
      console.log(event);
      // restart countDown
      myController.switchScenes()
    };
  }else{
      console.log(state)
  }
});

