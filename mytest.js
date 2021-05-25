
const fs = require("fs");
let content = "<html><head><meta http-equiv='refresh' content='30' /><style>body{overflow-x:hidden;overflow-y:hidden} img{height: 100vh;width: 100vw;}</style></head><body height='100vh'><img  src='./profile_pic/0.jfif'><script></script></body></html>"
fs.writeFile("test.html",content, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 


