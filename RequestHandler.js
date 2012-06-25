//request handler
exports.handleRequest = handleRequest;

var template = require("./templates");
var fs = require("fs");
var arena = require('./arena');
var connect = require('connect');
var url = require('url';

var handler = {};
handler['/'] = index;
handler['/index'] = index;
handler['/joingame'] = joinGame;
handler['/favicon.ico'] = icon;
handler['/style/base.css'] = css;
handler['/img/test.png'] = img;
handler['/img/bug.png'] = img;
handler['/sendactions'] = sendActions;

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
  if(typeof handler[url.parse(request.url).pathname.toLowerCase()] === 'function') {
    console.log('request sent function for ' + request.url);
    handler[url.parse(request.url).pathname.toLowerCase()](request, response);
  }
  else {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.end('404 not found');
  }
}

function joinGame(req, res) {
  var sess = req.session;
  if(!sess.game || !sess.player  {
    sess.player = connect.utils.uid(50);
    sess.game = arena.gameManager.addPlayer(sess.player);
  }
  
  res.writeHead(302, { 'Location': '/game' });
  res.end();
}

function game(req, res) {
  var game = req.session.game;
  var player = req.session.player;  
  if(game && player && arena.gameManager.validate(game, player)) {
    response.writeHead(200, {"Content-Type": "text/html"});
    template.renderTemplate('game.html', 'content', function(data) {
      res.end(data);
    });
  } 
  else {
    res.writeHead(302, { 'Location': '/game' });
    res.end();
  }
}

function sendActions(req, res) {
  var postData = '';
  req.addListener('data', function(chunk) {
    postData += chunk;
  });
  req.addListener('end', function() {
    cosoloe.log('request received at ' req.url);
    if(postData != '') {
      arena.gameManager.handleActions(req.session.game, req.session.player, JSON.parse(postData), function() {
        sendGameState(req, res);
      });
    }
    else {
      res.end();
    }
  });
}

function sendGameState(req, res) {
  
}
