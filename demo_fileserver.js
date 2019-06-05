var http = require('http');
var url = require('url');
var fs = require('fs');
 


http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  console.log("q "+ q.pathname);
  console.log("IP "+ req.connection.remoteAddress);
/*  
for ( f in req){
  console.log("f "+ f);
} */
  var filename = "." + q.pathname;
  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      console.log("404 Not Found"+ filename);
      return res.end("404 Not Found");
    } 
    res.writeHead(200, { });
    console.log("file " + filename);
    res.write(data);
    return res.end();
  });

}).listen(8080);
console.log(" http://localhost:8080/index.html");

/* http://localhost:8080/index.html */
/* http://localhost:8080/winter.html */