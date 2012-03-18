var ServiceDriver = require("./../modules/utils/ras_driver").ServiceDriver;
var assert = require('assert');

var proxy_host = "172.20.99.56";
var proxy_port = 46522;

var options = {
    host: proxy_host,
    port: proxy_port,
    path: "http://ras.arbitr.ru/",
    headers: {
        Host: "ras.arbitr.ru"
}};      

var service = new ServiceDriver(options);

service.getCategories({
    end: function(data) {
       assert.equal(typeof data, "object", "Ошибка: не правильный формат выходных данных");
       assert.notEqual(typeof data.length, undefined, "Ошибка: объект не является массивом - " + data.length);
       console.log("Тест getCategories успешно пройден, всего найденно категорий  ", data.length);
    },
    error: function(error) {
        console.log(error);
    }
});

service.getDocumentText({
    id: "bcf88539-5262-40a7-9332-b0764da8fbe1",
    end: function(data){
        assert.equal(typeof data, "string", "Ошибка: не правильный формат выходных данных");
        console.log("Тест getDocumentText успешно пройден, всего найденно символов  ", data.length);
    },
    error: function(error){
        console.log(error);
    }
});

service.getDocumentsList({
    category: "3c46c4cb-b820-4f8d-8740-15fc744a05a8",
    end: function(data){
        assert.equal(typeof data, "object", "Ошибка: не правильный формат выходных данных");
        assert.notEqual(typeof data.length, undefined, "Ошибка: объект не является массивом - ", data);
        
        assert.notEqual(data[0], undefined, "Ошибка: объект не является массивом ", data);
        assert.notEqual(data[0].id, undefined, "Ошибка: не правильный формат выходных данных, нет поля id", data);
        assert.notEqual(data[0].title, undefined, "Ошибка: не правильный формат выходных данных, нет поля title", data);
        assert.notEqual(data[0].category, undefined, "Ошибка: не правильный формат выходных данных, нет поля category", data);
        
        console.log("Тест getDocumentsList успешно пройден, всего найденно документов  ", data.length);
    },
    error: function(error){
        console.log(error);
    }
});