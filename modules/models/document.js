var db_connection = require("./../utils/db_driver").db_connection;


/**
* Конструктор новго документа в системе
* @params.id - идентификатор документа во внешней системе
* @params.name - имя, заголовок документа
* @params.date - дата 
* @params.possible_category - возможная категория, которую необходимо проверить
* @params.text - текст документа, который будет проанализирован и превращен в термы
* @params.comlete() - функция обратного вызова при успешном сохраенени документа
* @params.error(error) - функция обратного вызова при ошибки сохранения докумнета в системе
*/
var Document = function(params) {
    this.id = params.id || (new Date()).getTime(); // идентификатор документа в системе
    this.name = params.name; // название
    this.date = params.date || new Date(); // дата документа
    this.category = params.category; // категория если установленна
    this.possible_category = params.possible_category; // категория, которую необхоидмо подтвердить
    
    this.text = params.text ;  // текст документ
    this.terms = []; // список всех термов встреченных в документе 
    
    // сохраняем описание документа
    this.collection = db_connection.collection('document');
    var self = this;
    
    // проверяем нет ли такой категории в базе
    this.collection.find({id: this.id}).toArray(function(err, objects){
        // если для данная категория еще не существует!
        if(objects.length == 0) {
            self.collection.insert({
                                        name: self.name, 
                                        id: self.id,
                                        text: self.text
                                    }, 
                                    {safe:true}, function(err, objects) {
                if (err && !params.error) {
                    console.warn(err.message);
                } else if (params.error) {
                    params.error(err.message);
                } 
            });
        } 
    });
};

/**
* Метод получения документа по его идетификатору
* !@params.id - идетификатор документа
* @params.end(Docunent) - функция которая будет вызвана после успешной загрузки документа
* @params.error(error) - функция которая будет вызвана при ошибки
*/
Document.getById = function (params) {
   
    if (!params) {
        console.log("Функции обратного вызова не определенны");
        return;
    } else if(!params.end && !params.error) {
        console.log("Функции обратного вызова не определенны");
        return;
    } else if (!params.end && params.error && typeof params.error == "function") {
        params.error("Функция load обратного вызова не определенны");
        return;
    }

    params.end(new Document(params.id));
    return;
}

/**
 * Метод получения списка документов по заданным параметрам
 */
Document.getDocumentsList = function (params) {
    var documents = new Array();
    
    Document._getList({
        end: function(list) {
            console.log(list);
        }
    })
}



exports.Document = Document