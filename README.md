
# facebook win

![alt text](https://github.com/larbikhounti/facebook_win/blob/main/images/Live-interactive01.png?raw=true)

![alt text](https://github.com/larbikhounti/facebook_win/blob/main/images/Live-interactive02.png?raw=true)

![alt text](https://github.com/larbikhounti/facebook_win/blob/main/images/Live-interactive03.png?raw=true)

initiate live stream to facebook using obs-websocket,
for each comment on the live video,
the script will take the commenter name and he profile picture and will be displayed on the live stream itself.

live example : https://web.facebook.com/watch/live/?ref=watch_permalink&v=428462101245800


```diff
+ you will need to create an app on facebook account (normal if you worked with google , meta and other big tech)
+ also you need to set up permissions for the app for ex: read comments, start live stream.
+ to use the fully power of it its need to be reviewed by facebook team ( in my case its already approved )
 
```
## Variables needed

To run this project, you will need to add the following environment variables to your .env file
#### obs 26.1.1
#### obs config
`ADRESS = localhost:4444`

`PASSWORD  = password_you_created_on_obs`


#### facebook config
`ACCESS_TOKEN = your_app_access_token`

`VIDEO_ID = your_live_facebook_video_id`


## steps 

- add obs websocket plugin you can ge it from [obs-websocket](https://github.com/Palakis/obs-websocket/releases)

- set the adress and the password you will need to add them on .env file

- generate facebook app user token or user token with those permissions [public_profile,user_videos] you will need the token to add it on .env file [from here](https://developers.facebook.com/tools/explorer/) 

- add count down script to obs and set time and input name (you will find it on scripts directoy)


## Run Locally

Clone the project

```bash
  git clone https://github.com/larbikhounti/facebook_win.git
```

Go to the project directory

```bash
  cd facebook_win
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

  
## Authors

- [@mohamed khounti ](https://github.com/larbikhounti)

  
