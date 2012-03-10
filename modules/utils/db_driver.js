/* 
 * Модуль отвечает за взаимодействие с DB
 */

var mongode = require('./../../lib/mongode'); 
var connection = mongode.connect('test', '127.0.0.1');

exports.db_connection = connection;


/**
 * Метод добавления категории спора в базу
 * @param
 *      category - категория спора {id:'123', name: 'adf'}
 *      end - функция, которая должна быть выполенна после успешного завершения
 *      error - функция которая будет выполненна при ошибки
 */
/*
exports.saveCaseCategory = function(params) {
    console.log(params.category.name);
    category.insert({name: params.category.name.toString("utf8")}, {safe:true}, function(err, objects) {
        if (err) console.warn(err.message);
        if (params.error) {
            params.error(err.message);
        } else {
            //console.log("Error" + err.message);
        }
    });
    
    if (params.end) {
        params.end();
    }
}*/