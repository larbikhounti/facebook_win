
const obsController =  require("./obsController")
var FB = require('fb');
FB.setAccessToken('EAAeKlDx3HnsBAEZCQBvZAftVL1aG6q61RKzGIGeoLhgbBRbggkDKlP4XK4DB94aebIxwMA884LAyOPvZC90P5KXRRgIBchksGerHXOvjZBOiBnheSWX1yEtxlgkH00fCmOmJLd2gZAokRjFRfJq2t3EIHxzMjXTZBf9b1AZChIrEEFbIDVgZBHCIHuq7q3gc6l3t5fqG1CSywYMPB2ZBEdFmgSuWmYWBIqqETth1fVSRhZCQZDZD');
const myController = new obsController()
myController.Connect().then(state=>{
    if(state){
        console.log(state)
        commentListining("4016367878423475")
    }
})


let currentCommentsLength = 0;

function commentListining(videoLiveId) {
    setInterval(() => {
    FB.api(videoLiveId+'/comments', function (res) {
        if(!res || res.error) {
         console.log(!res ? 'error occurred' : res.error);
         return;
        }
        // if there is new comments 
        if(res.data.length >currentCommentsLength ){
            //save comments
            let comments = res.data;
            // loop throw every new comment
            for(let i = currentCommentsLength;i<res.data.length;i++){
                    console.log(comments[i])
            }
            // seeting current comment length to new length
            currentCommentsLength = res.data.length;
            
           // console.log(res.data.length);
        }else{
            console.log("nothing new")
        }
        
      
      });    
}, 10000);
}


