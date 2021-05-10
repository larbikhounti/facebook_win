const fetch = require("node-fetch");
require("dotenv").config();
const chalk = require("chalk");
//const {fbUID} = require('../config')

async function startLiveVideo(data) {
  console.log(chalk.yellow("sending facebook request to start live video.."));
  return await fetch(
    `https://graph.facebook.com/v10.0/me/live_videos?access_token=${data.accessToken}`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  )
    .then((res) => {
      console.log(chalk.green("facebook connected."));
      return res.json();
    })
    .catch((ex) => console.log(ex));
}

const deleteLiveVideo = (postId, accessToken) => {
  fetch(
    `https://graph.facebook.com/v10.0/${postId}?access_token=${accessToken}`,
    { method: "DELETE" }
  )
    .then((res) => res.json())
    .catch((ex) => console.log(ex));
};

const endLiveVideo = (postId, accessToken) => {
  fetch(
    `https://graph.facebook.com/v10.0/${postId}?end_live_video=true&access_token=${accessToken}`,
    { method: "POST" }
  )
    .then((res) => res.json())
    .catch((ex) => console.log(ex));
};

const getAllLiveVideos = (accessToken) => {
  fetch(
    `https://graph.facebook.com/v10.0/me/live_videos?access_token=${accessToken}`,
    { method: "GET" }
  )
    .then((res) => res.json())
    .catch((ex) => console.log(ex));
};
//  const getUserPicture =  async (UID) => {
//   //  "https://graph.facebook.com/v10.0/4014533155273614/picture?height=500&width=500"
//  return  await fetch(
//     `https://graph.facebook.com/v10.0/${UID}/picture?height=500&width=500&redirect=0`,
//     { method: "GET"}
//   )
//     .then((res) => res.json())
//     .catch((ex) => console.log(ex));
// };
async function getUserPicture(UID) {
  
  return  await fetch(
    `https://graph.facebook.com/v10.0/${UID}/picture?height=500&width=500&redirect=0`,
    { method: "GET"}
  )
    .then((res) => res.json())
    .catch((ex) => console.log(ex));
}

exports.startLiveVideo = startLiveVideo;
exports.deleteLiveVideo = deleteLiveVideo;
exports.endLiveVideo = endLiveVideo;
exports.getAllLiveVideos = getAllLiveVideos;
exports.getUserPicture = getUserPicture;

exports.privacies = {
  public: "{'value': 'EVERYONE'}",
  friends: "{'value': 'ALL_FRIENDS'}",
  friends_of_friends: "{'value': 'FRIENDS_OF_FRIENDS'}",
  // private: `{'value':'CUSTOM', allow:'${fbUID}'}`
};
