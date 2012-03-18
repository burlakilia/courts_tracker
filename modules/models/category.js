/* 
 * Модель описывающаяя категории судебных решений
 */
var db_connection = require("./../utils/db_driver").db_connection;

/**
 * Коструктор новой категории категории
 * @params.id - идентификатор категории во внешней системе 
 * @params.name - название категории
 * @params.end(Category) - функция обратного вызова если категория успешно сохраенена
 * @params.error - функция обратного вызова, которая будет вызвана при ошибки
 */
var Category = function(params) {
    if (!params) {
        console.error("Параметры не заданы!");
        return;
    } else if (!params.id || !params.name) {
        if (!params.error) {
            console.error("Не все обязательный параметры определенны");
        } else { 
            params.error("Не все обязательный параметры определенны");
        }
        return;
    } 
    
    this.collection = db_connection.collection('category');
    
    this.id = params.id; // идентификтор во вншней системе
    this.name = params.name; // название категории
    
    var self = this;
    
    // проверяем нет ли такой категории в базе
    this.collection.find({id: self.id}).toArray(function(err, objects){
      
        // если для данная категория еще не существует!
        if(objects.length == 0) {
            self.collection.insert({
                name: params.name.toString("utf8"), 
                id: self.id
            }, {safe:true}, function(err, objects) {
              
                if (err && !params.error) {
                    console.warn(err.message);
                } else if (params.error) {
                    params.error(err.message);
                } else if (params.end != undefined && typeof params.end == "function") {
                    params.end(self);
                }
                
            });
        } else {
            self.id = objects[0].id;
            self.name = objects[0].name;

            if (err && !params.error) {
                console.warn(err.message);
            } else if (params.error) {
                params.error(err.message);
            } else if (params.end != undefined && typeof params.end == "function") {
                params.end(self);
            }
        }
        
    });
}

Category.removeAll = function() {
    this.ctollection = db_connection.collection('category');
    this.ctollection.remove();
}

exports.Category = Category;