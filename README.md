
# facebook win

initiate live stream to facebook using obs-websocket,
for each comment on the live video
the scene will change causing the countDown script
to  restart.




## Variables needed

To run this project, you will need to add the following environment variables to your .env file

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

  