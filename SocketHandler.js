var arena = require('./arena');
var connect = require('connect');

exports.handleSocket = handleSocket;

function handleSocket(socket) {
  var playerId = connect.utils.uid(50);;
  var gameId = arena.gameManager.addPlayer(playerId);
  console.log("the game id for player " + playerId + " is " + gameId)
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
  });

  socket.on('actions', function(actions) {
    console.log('received actions: ' + JSON.stringify(actions));
    arena.gameManager.handleActions(gameId, playerId, actions);
  });

  if(arena.gameManager.games[gameId].isFull()) {
    arena.gameManager.games[gameId].start();
  }
  
}