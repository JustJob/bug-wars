var DEFAULT_BUG_ENERGY = 40;

//utility functions
function forEachIn(object, action) {
  for (var property in object) {
    if (object.hasOwnProperty(property))
      action(property, object[property]);
  }
}

//bugger arena
function BugArena(p_initMap) {
  this._map = this.createMap(p_initMap);
}

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
  if(this.mapHasBug(x1,y1,playerId)) {
    
  }
};

BugArena.prototype.mapHasBug = function(x,y,playerId) {
  if(typeof this._map[y][x] === "object" && this._map[y][x].playerId)
  {
    return this._map[y][x].playerId;
  }
  return undefined;
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

var Wall = function(x,y) {
  this.x = x;
  this.y = y;
};

Wall.prototype.getHtml = function() {
  return "<td class=\"column" + this.y + " background-wall\"/>";
};

var map = ["xxxxx",
           "x  Bx",
           "xb  x",
           "x   x",
           "xxxxx"];
           
exports.ba = new BugArena(map);
