const obsController = require("./obsController");
const EventSource = require("eventsource");
require('dotenv').config();
// create instance of obs Controller and passing adress and password of obs socket
const myController = new obsController(process.env.ADRESS,process.env.PASSWORD);



// setting token and video id
<<<<<<< HEAD
let access_token = process.env.ACCESS_TOKEN
let video_id = process.env.VIDEO_ID
=======
let access_token ="EAAeKlDx3HnsBADgCliAyhEPoY919BbaR282zAauALzJEHupD4e6aiVTywrRmcPeMjs1HGwFidpdwcqjSsKRBnQay42iGMpOw7ISN0kjwluKwWLbc8ZCFETGrHELXMHwFt2Dx4ZBPiwYZA4WeEnk2PUrvwrZAIZA608POitsLuVnpQu22Vh0ECGcfvwmhZAEe9ZCeZBBBrvhu4wZDZD"
let video_id = "795162048097755";
>>>>>>> d9ff40b47f342834b5d186b381954baafc9a06d2
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

