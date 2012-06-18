//node.js stuffs
var http = require("http");
var sys = require("sys");
var handle = require("./RequestHandler");

function onRequest(request, response) {
  console.log("request: " + request.url);
  handle.handleRequest(request, response);
}

http.createServer(onRequest).listen(8080);
