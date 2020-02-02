let http = require('http');
let PORT = 8009;

let express = require('express');
let app = express();

/*let server = http.createServer(reqHandler);

function reqHandler(req,res) {
  res.writeHead(200);
  res.end("Hello all", req);
}

server.listen(PORT);*/

let server = http.createServer(app).listen(PORT, function() {
  console.log("Server listening on port: " + PORT);
});

app.use(express.static('public'));
