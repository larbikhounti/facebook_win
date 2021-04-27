var FB = require('fb');
FB.setAccessToken('EAAeKlDx3HnsBAN3ZCr2nrnr6H3Atssib3rT00PseivNKijS0NLkx1FW18vs5lUupgPTaWEkK5vPTuCBMZCstrUFGCj1AQhyfiZCFYsZAcnGh5ZAzcKMc9NdSfJrmFsuOAlmic3Gnp2J6nkAhjPhcZAblCjpd8SvYp28UmxvHsNPEoqHLzZANZBTPYADrUX3QCH6MZBceeHV7cUPBhBXG227beHOHqVzZAq3zUQhatzlhUD8gZDZD');
let currentCommentsLength = 0;
setInterval(() => {
    FB.api('4015881245138805/comments', function (res) {
        if(!res || res.error) {
         console.log(!res ? 'error occurred' : res.error);
         return;
        }
        // if there is new comments 
        if(res.data.length >currentCommentsLength ){
            //save comments
            let comments = res.data;
            for(let i = currentCommentsLength;i<res.data.length;i++){
                    console.log(comments[i])
            }
            currentCommentsLength = res.data.length;
            
           // console.log(res.data.length);
        }else{
            console.log("nothing new")
        }
        
      
      });    
}, 10000);
