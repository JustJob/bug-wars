var arena = require('./arena');
var connect = require('connect');

exports.handleSocket = handleSocket;

function handleSocket(socket) {
  var playerId = connect.utils.uid(50);;
  var gameId = arena.gameManager.addPlayer(playerId);
  //send ready message once game is full
  arena.gameManager.watchGame(gameId, function(map) {
    socket.emit('ready', map);
  });
  //send your turn message once it is your turn
  arena.gameManager.watchTurn(gameId, playerId, function() {
    socket.emit('turn');
  });
  //register view to be updated when other players move
  arena.gameManager.registerView(gameId, playerId, function(map) {
    socket.emit('update', map);
  }

  socket.on('actions', function(actions) {
    arena.gameManager.handleActions(gameId, playerId, actions, function() {
      arena.gameManager.updatePlayerViews(gameId);
    });
  });
}