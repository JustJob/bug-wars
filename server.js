//node.js stuffs
var http = require("http");
var sys = require("sys");
var handle = require("./RequestHandler");
var connect = require('connect');

var secret = connect.utils.uid(50);

function onRequest(request, response) {
  handle.handleRequest(request, response);
}

var app = connect()
  .use(connect.logger('dev'))
  .use(connect.favicon())
  .use(connect.cookieParser(secret))
  .use(connect.session({ cookie: { maxAge: 60000 }}))
  .use(function(req, res, next){
    var sess = req.session;
    if (sess.views) {
      
    } 
    else {
      
    }
  })

http.createServer(app).listen(8080);
