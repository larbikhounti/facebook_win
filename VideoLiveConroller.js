const fetch = require("node-fetch");
require('dotenv').config();
//const {fbUID} = require('../config')

async function startLiveVideo(data) {
  console.log("data .acess   "+data.accessToken);
  return await fetch(
    `https://graph.facebook.com/v10.0/me/live_videos?access_token=${data.accessToken}`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  ).then((res) => res.json()).catch(ex=>console.log(ex));
}

const deleteLiveVideo = (postId, accessToken) =>
  req({
    uri: `https://graph.facebook.com/v10.0/${postId}?access_token=${accessToken}`,
    method: "DELETE",
    json: true,
  });

const endLiveVideo = (postId, accessToken) =>
  req({
    uri: `https://graph.facebook.com/v10.0/${postId}?end_live_video=true&access_token=${accessToken}`,
    method: "POST",
    json: true,
  });

const getAllLiveVideos = (accessToken) =>
  req({
    uri: `https://graph.facebook.com/v10.0/me/live_videos?access_token=${accessToken}`,
    method: "GET",
    json: true,
  });

exports.startLiveVideo = startLiveVideo;
exports.deleteLiveVideo = deleteLiveVideo;
exports.endLiveVideo = endLiveVideo;
exports.getAllLiveVideos = getAllLiveVideos;

exports.privacies = {
  public: "{'value': 'EVERYONE'}",
  friends: "{'value': 'ALL_FRIENDS'}",
  friends_of_friends: "{'value': 'FRIENDS_OF_FRIENDS'}",
  // private: `{'value':'CUSTOM', allow:'${fbUID}'}`
};
