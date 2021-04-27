const obsController = require("./obsController");
const EventSource = require("eventsource");
// create instance of obs Controller and passing adress and password of obs socket
const myController = new obsController("localhost:4444","admin");

// setting token and video id
let access_token =
  "EAAeKlDx3HnsBAHN8NWPEE3ZCPuRpqZBhz1BnlDpJj47CRz03eSe5OATxYC59Mf7jWtwjfmqcKX5oZA3Ntzcn26XAiDmKzAOfX4iTK66FRbvMZBLrbG0cv8G7FC8Qh7nibSCmxchZA6ULAMcZCdgzPQIpbDTIjcmWJ73M7CzWAPWBBOMZASR8o51VEt0NveGRXvZCUAZAsQNtITwZDZD";
let video_id = "390622588607928";
let source = new EventSource(
  "https://streaming-graph.facebook.com/" +
    video_id +
    "/live_comments?access_token=" +
    access_token +
    "&comment_rate=one_per_two_seconds&fields=from{name,id},message"
);


// connecting to obs and starting the stream
myController.Connect().then((state) => {
  if (state) {
      // if stream started listen to comments
    source.onmessage = function (event) {
      console.log(event);
      // play the stream from the start
    };
  }
});

