//templates

var fs = require("fs");

function renderTemplate(file, game, callback) {
  fs.readFile("./templates/" + file, function(err, data) {
    var replaced = data.toString().replace("{{ content }}", game);
    if(callback) {
      callback(replaced);
    };
  });
}

exports.renderTemplate = renderTemplate;
