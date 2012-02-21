/* 
 * Паук, который проверяет сервис ras.arbitr.ru на наличие обновлений
 * за заданный период 
 */

/**
 * Конструктор паука 
 * @param option - настройки
 */
//var mongode = require('../lib/mongode');
//var test = mongode.connect('test', '127.0.0.1');
//var collection = test.collection('test_collection');
//
//collection.insert({hello: 'world'}, {safe:true}, function(err, objects) {
//  if (err) console.warn(err.message);
//});

var Spider = function (options) {
    this._interval = options.interval || 1000; // интервал, с переодчность которой буду происходить обновления
}

Spider.prototype.addStem = function (stem) {
    consoel.log(stem);
}

exports.Spider = Spider;