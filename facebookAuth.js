const queryString = require('query-string');
const fetch = require('node-fetch');
const open = require('open');
require('dotenv').config();

class facebookAuth {
  constructor() {}
  // get user permissions
  getUserpermissions() {
    const stringifiedParams = queryString.stringify({
      client_id: process.env.CLIENT_ID,
      redirect_uri: "http://localhost:3000/authenticate/facebook/",
      scope: ["public_profile", "user_videos", "pages_show_list"].join(","), // comma seperated string
      response_type: "code",
      auth_type: "rerequest",
      display: "popup",
    });
    const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;

    open(facebookLoginUrl);
  }
  //get access token from code
  async getAccessTokenFromCode(code) {
      let isAccessTokenPresent = false;
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.APP_SECRET;
    const url = new URL(
      `https://graph.facebook.com/v4.0/oauth/access_token?redirect_uri=http://localhost:3000/authenticate/facebook/&client_id=${client_id}&client_secret=${client_secret}&code=${code}`
    );
    await fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json.access_token) {
         // save ACCESS_TOKEN in .env
          process.env.ACCESS_TOKEN = json.access_token;
          isAccessTokenPresent = true
        }
        console.log(process.env.ACCESS_TOKEN);
      });

    // return data.access_token;
    return isAccessTokenPresent
  }
}
module.exports = facebookAuth;