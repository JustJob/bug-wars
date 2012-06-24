var DEFAULT_BUG_ENERGY = 40;
var ENERGY_PER_SPACE = 5;
var COMBINATION_COST = 10;
var map = ["xxxxx",
           "x  Bx",
           "x   x",
           "xb  x",
           "xxxxx"];

//utility functions
function forEachIn(object, action) {
  for (var property in object) {
    if (object.hasOwnProperty(property))
      action(property, object[property]);
  }
}

//game manager
function ArenaManager() {
  var games = {};
  var openGames = [];
  var players = [];
}

ArenaManager.prototype.createGame = function() {
  var gameId = connect.utils.uid(50);
  if(!this.games[gameId]) {
    this.games[gameId] = new BugArena(map);
    this.openGames.push(this.games[gameId]);
  }
  else throw "Duplicate game id";
};

ArenaManager.prototype.validate = function(game, player) {
  return games[game] && games[game].hasPlayer(player);
};

ArenaManager.prototype.addPlayer = function(player) {
  if(this.openGames.length <= 0) {
    this.createGame();
  }
  
  var lastGameId = this.openGames[this.openGames.length - 1];
  this.games[lastGameId].addPlayer(player);
  if(this.games[lastGameId].isFull()) {
    this.start(this.games[this.openGames.pop()]);
  }
  
  return lastGameId;
};

//bugger arena
function BugArena(p_initMap, p_maxPlayers) {
  if(p_initMap.length < 1)
    throw "Invalid map size. Height < 1";
  for(row p_initMap) {
    if(row.length < 1) throw "Invalid map size. Width of a row < 1";
  }
  this._map = this.createMap(p_initMap);
  this.height = p_initMap.length;
  this.width = p_initMap[0].length;
  this.players = [];
  
  if(p_maxPlayers) {
    this.maxPlayers = p_maxPlayers;
  }
  else {
    this.maxPlayers = 2;
  }
}

BugArena.prototype.hasPlayer = function(playerId) {
  return this.players.indexOf(playerId) !== -1;
};

BugArena.prototype.createMap = function(p_2dArray) {
  var map = [];
  for(var y = 0; y < p_2dArray.length; y++) {
    var row = [];
    for(var x = 0; x < p_2dArray[y].length; x++) {
      row.push(this.getObjectFromLetter(x,y,p_2dArray[y][x]));
    }
    map.push(row);
  }
  return map;
};

BugArena.prototype.addPlayer = function(playerId) {
  this.players.push(playerId);
};

BugArena.prototype.getHtml = function(indent) {
  if(!indent)
  {
    indent = "";
  }
  retval = indent + "<table id=\"arena\">\n";
  for(var y = 0; y < this._map.length; y++) {
    retval += indent + "  <tr class=\"row" + y + "\">\n";
    for(var x = 0; x < this._map[y].length; x++) {
      if(this._map[y][x] != null)
      {
        retval += indent + "    " + this._map[y][x].getHtml() + "\n";
      }
      else
      {
        retval += indent + "    <td class=\"column" + x + " background-empty\"/>\n";
      }
    }
    retval += "  </tr>\n";
  }
  retval += "</table>\n";
  return retval;
};

BugArena.prototype.getObjectFromLetter = function(x,y,letter) {
  retval = null;
  switch(letter) {
    case "x":
      retval = new Wall(x,y);
      break;
    case "b":
      //player 1 bugs
      retval = new Bug(x,y,1);
      break;
    case "B":
      //player2 bugs
      retval = new Bug(x,y,2);
      break;
    case " ":
      break;
    default:
      throw "Invalid letter: " + letter;
      break;
  }

  return retval;
};

BugArena.prototype.move = function(x1,y1,x2,y2,playerId) {
  var bug = this.mapHasBug(x1,y1,playerId)
  if(bug && this.distance(x1,y1,x2,y2) < 2) {
    var destinationObject = getObjectAt(x2,y2);
    bug.energy -= ENERGY_PER_SPACE;
    
    //move to empty space
    if(!destinationObject) {
      this._map[y1][x1] = undefined;
      
      if(bug.energy > 0) {
        bug.x = x2;
        bug.y = y2;
        this._map[y2][x2] = bug;
      }
      else {
        bug.destroy(this);
      }
    }
    else if(destinationObject.prototype.constructor === Bug)
    {
      //move onto your own bug
      if(destinationObject.playerId === playerId)
      {
        destinationObject += bug.energy - COMBINATION_COST;
        bug.destroy(this);
      }
      //move onto enemy bug
      else
      {
        if(bug.energy > destinationObject.energy) {
          bug.energy -= destinationObject.energy;
          destinationObject.destroy(this);
        }
        else if(destinationObject.energy > bug.energy) {
          destinationObject.energy -= bug.energy;
          bug.destroy(this);
        }
        else {
          bug.destroy(this);
          destinationObject.destroy(this);
        }
      }
    }
  }
};

BugArena.prototype.getObjectAt = function(x,y) {
  return this._map[y][x];
};

BugArena.prototype.mapHasBug = function(x,y,playerId) {
  var objectAt = this.getObjectAt(x,y);
  if(typeof objectAt === "object" && objectAt.prototype.constructor === Bug && objectAt.playerId === playerId)
  {
    return objectAt;
  }
  return undefined;
};

BugArena.prototype.destroy = function(object) {
  if(object.x > 0 && object.x < this.width && object.y > 0 && object.y < this.height)
  {
    if(this.getObjectAt(object.x, object.y) == object) {
      this._map[object.y][object.x] = undefined;
      object.x = undefined;
      object.y = undefined;
    }
    else throw "trying to destroy object but x and y coordinates did not align with the map";
  }
  else throw "trying to destory object in invalid position";
};

var Bug = function(x,y,playerId) {
  this.x = x;
  this.y = y;
  this.playerId = playerId;
  this.energy = DEFAULT_BUG_ENERGY;
};

Bug.prototype.getHtml = function() {
  retval = "<td class=\"column" + this.y + " background-bug " + 'player' + this.playerId + "\"><span>";
  retval += this.energy;
  retval += "</span></td>";
  return retval;
};

Bug.prototype.destroy = function(arena) {
  if(arena) arena.destroy(this);
  else throw "can not destroy bug from an undefined arena";
};  

var Wall = function(x,y) {
  this.x = x;
  this.y = y;
};

Wall.prototype.getHtml = function() {
  return "<td class=\"column" + this.y + " background-wall\"/>";
};

exports.gameManager = new ArenaManager();
