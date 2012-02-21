var http = require("http");
var url = require("url");
var mongode = require('./lib/mongode');
var test = mongode.connect('test', '127.0.0.1');

var collection = test.collection('test_collection');

collection.insert({hello: 'world'}, {safe:true}, function(err, objects) {
  if (err) console.warn(err.message);
});
var robot = require("./modules/robot"); // работ, который собирает информацию 

console.log(mongode);

robot.startObserve();
