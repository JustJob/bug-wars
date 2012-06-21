var DEFAULT_BUG_ENERGY = 40;
var ENERGY_PER_SPACE = 5;
var COMBINATION_COST = 10;

//utility functions
function forEachIn(object, action) {
  for (var property in object) {
    if (object.hasOwnProperty(property))
      action(property, object[property]);
  }
}

//bugger arena
function BugArena(p_initMap) {
  if(p_initMap.length < 1)
    throw "Invalid map size. Height < 1";
  for(row p_initMap) {
    if(row.length < 1) throw "Invalid map size. Width of a row < 1";
  }
  this._map = this.createMap(p_initMap);
  this.height = p_initMap.length;
  this.width = p_initMap[0].length;
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
        bug.destroy();
      }
    }
    else if(destinationObject.prototype.constructor === Bug)
    {
      //move onto your own bug
      if(destinationObject.playerId === playerId)
      {
        destinationObject += bug.energy - COMBINATION_COST;
        bug.destroy();
      }
      //move onto enemy bug
      else
      {
        if(bug.energy > destinationObject.energy) {
          bug.energy -= destinationObject.energy;
          destinationObject.destroy();
        }
        else if(destinationObject.energy) {
          destinationObject.energy -= bug.energy;
          bug.destroy();
        }
        else {
          bug.destroy();
          destinationObject.destroy();
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

var Bug = function(x,y,playerId) {
  this.x = x;
  this.y = y;
  this.playerId = playerId;
  this.energy = DEFAULT_BUG_ENERGY;
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

Bug.prototype.getHtml = function() {
  retval = "<td class=\"column" + this.y + " background-bug " + 'player' + this.playerId + "\"><span>";
  retval += this.energy;
  retval += "</span></td>";
  return retval;
};

Bug.prototype.destroy = function() {
  BugArena.destroy(this);
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
