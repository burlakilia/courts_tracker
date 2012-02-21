/* 
**
* Модуль служит для запуска парсеров сайто решений суда
 */

var agent = require("./modules/crawler");


// TODO пока что сделанна заглушка т.к. я не могу разобратся с их API?
agent.start({ host:"localhost", port:8888 }, function(list) {
    console.log(list);
});

