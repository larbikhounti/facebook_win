var FB = require('fb');
FB.setAccessToken('EAAeKlDx3HnsBAN3ZCr2nrnr6H3Atssib3rT00PseivNKijS0NLkx1FW18vs5lUupgPTaWEkK5vPTuCBMZCstrUFGCj1AQhyfiZCFYsZAcnGh5ZAzcKMc9NdSfJrmFsuOAlmic3Gnp2J6nkAhjPhcZAblCjpd8SvYp28UmxvHsNPEoqHLzZANZBTPYADrUX3QCH6MZBceeHV7cUPBhBXG227beHOHqVzZAq3zUQhatzlhUD8gZDZD');

setInterval(() => {
    FB.api('4015881245138805/comments', function (res) {
        if(!res || res.error) {
         console.log(!res ? 'error occurred' : res.error);
         return;
        }
        console.log(res.data.length);
      
      });    
}, 10000);
