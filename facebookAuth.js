const queryString = require('query-string');
const fetch = require('node-fetch');
const open = require('open');
require('dotenv').config();
const chalk = require("chalk");
class facebookAuth {
  constructor() {}
  // get user permissions
  getUserpermissions() {
    const stringifiedParams = queryString.stringify({
      client_id: process.env.CLIENT_ID,
      redirect_uri: "http://localhost:3000/authenticate/facebook/",
      scope: ["public_profile", "pages_manage_posts","user_videos", "pages_show_list","user_events","pages_show_list","pages_read_engagement","pages_read_user_content"].join(","), // comma seperated string
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
      .then(async (json) => {
        if (json.access_token) {
          console.log(chalk.green("facebook access token connected."))
          // save ACCESS_TOKEN in .env
          //process.env.ACCESS_TOKEN = json.access_token; 
          process.env.ACCESS_TOKEN = await  this.getPageAcessToken(json.access_token).then(pageToken=>pageToken);
         // console.log(await  this.getPageAcessToken(json.access_token).then(pageToken=>pageToken))
          isAccessTokenPresent = true

        }
       
      }).catch(ex=>console.log(ex));

    // return data.access_token;
    return isAccessTokenPresent
  }
  // get page Access token  from user access token
 async getPageAcessToken(userAccesToken){
   
   let url = `https://graph.facebook.com/${process.env.PAGE_ID}?fields=access_token&access_token=${userAccesToken}`
 return await fetch(url)
  .then((res) => res.json())
  .then((json) => {
    if (json.access_token) {
      console.log(chalk.green("facebook page access token connected."))
      return json.access_token 
    }else{
      console.log(json)
    }
   
  }).catch(ex=>console.log(ex));

  }
}
module.exports = facebookAuth;