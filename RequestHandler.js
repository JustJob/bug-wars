//request handler
exports.handleRequest = handleRequest;

var template = require("./templates");
var fs = require("fs");
var arena = require('./arena');

var handler = {};
handler['/'] = index;
handler['/index'] = index;
handler['/favicon.ico'] = icon;
handler['/style/base.css'] = css;
handler['/img/test.png'] = img;
handler['/img/bug.png'] = img;

function index(request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  template.renderTemplate("index.html", arena.ba.getHtml(), function(data) {
    response.end(data);
  });
}

function icon(request, response) {
  response.writeHead(200, {"Content-Type": "image/png"});
  fs.readFile('./img/test.png', function (err, data) {
    if (err) throw err;
    response.end(data);
  });
}

function css(request, response) {
  response.writeHead(200, {'Content-Type': 'text/css'});
  fs.readFile('.' + request.url, function(err, data) {
    if (err) throw err;
    response.end(data);
  });
};

function img(request, response) {
  response.writeHead(200, {'Content-Type': 'image/png'});
  fs.readFile('.' + request.url, function(err, data) {
    if (err) throw err;
    response.end(data);
  });
};

function handleRequest(request, response) {
  if(typeof handler[request.url] === 'function') {
    console.log('request sent function for ' + request.url);
    handler[request.url](request, response);
  }
  else {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.end('404 not found');
  }
}
