
function setWinnerCountDown()
{
    let count = 60;
    var interval = setInterval(function(str1, str2) {
        count--;
        console.log(count);
        if(count<=0){
            clearInterval(interval);
        }
      }, 1000, "Hello.", "How are you?");
      
      
}
a();