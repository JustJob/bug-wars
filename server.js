//node.js stuffs
var sys     = require("sys");
var connect = require('connect');

var secret = connect.utils.uid(50);

var connectApp = connect()
  .use(connect.logger('dev'))
  .use(connect.favicon())
  .use(require("./RequestHandler").handleRequest);

var app    = require("http").createServer(connectApp);
var io     = require('socket.io').listen(app);
app.listen(8080);

io
  .set('log level', 2)
  .of('/game')
  .on('connection', require("./SocketHandler").handleSocket);

