var db_connection = require("./../utils/db_driver").db_connection;
var Stem = require("./stem").Stem;


/**
* Конструктор новго документа в системе
* @params.id - идентификатор документа во внешней системе
* @params.name - имя, заголовок документа
* @params.date - дата 
* @params.category - категория которая присвоена документу (если не равна нулю то possible_category игнорится)
* @params.possible_category - возможная категория, которую необходимо проверить
* @params.text - текст документа, который будет проанализирован и превращен в термы
* @params.end() - функция обратного вызова при успешном сохраенени документа
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
    
  
    // получаем текст докумета
    if (params.service != undefined) {
        params.service.getDocumentText({
            id: this.id,
            end: function(data){
                self.text = data;
                self.addDocument(params);
            },
            error: function(error){
                console.log(error);
            }
        });
    } else {
      console.log("Не определенн сервис для документов !!"); 
    }

};

Document.prototype.addDocument = function(params) {
    var self = this;
    
    // проверяем нет ли такого документа в базе
    this.collection.find({id: this.id}).toArray(function(err, objects){
        // если для данная категория еще не существует!
        if(objects.length == 0) {
           // выполняем стемминг слов документа для данной категории!
           Stem.steming({
                    text: self.text,
                    category: self.category,
                    document: self.id,
                    end: function(_stems) {
                            self.collection.insert({
                                            name: self.name, 
                                            category: self.category,
                                            id: self.id,
                                            stems: _stems
                                        }, 
                                        {safe:true}, function(err, objects) {
                                            
                                            if (err && !params.error) {
                                                console.warn(err.message);
                                            } else if (params.error) {
                                                params.error(err.message);
                                            } else if (params.end != undefined && typeof params.end == "function") {
                                               params.end(objects[0]);
                                            }
                                        }); // end inserting
                    } // end stemming
            });
        } else {

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
Document.getDocumentsCount = function (params) {
    this.collection = db_connection.collection('document');
    
    this.collection.find().toArray(function(err, objects) {
        if (params.end != undefined && typeof params.end == "function") {
            params.end(objects.length);
        }
    })
}

/**
 * Метод проверки категории документа
 * @params.test - текст документа
 * @params.category - проверяемая категория
 */
Document.proccess = function(params) {

    var Mystem = require("./../utils/mystem").Mystem;
    var mystem = new Mystem();
    mystem.stemString(params.text, function(_stems){
            
            var p = 0;
            var n = 0;
            
            var countStem = 0;
            var ret_val = [];
            
            for(var i=0; i<_stems.length; i++) { 
                proccessStem(_stems[i],  params.category, _stems.length, function(stem, w, nw) {
                    
                    console.log(stem, w);
                    ret_val.push ({
                        stem: stem,
                        w: w,
                        nw: nw
                    });
                    
                    if (w != undefined && nw != undefined) {
                        p += w*n;
                        n += nw;
                    }
                    
                    console.log(countStem, _stems.length)
                    if (++countStem ==  _stems.length) {
                        var result = p/n;
                        console.log("P = ", p/n);
                        params.end(result, ret_val);
                    }
                    
                });
            }
            
        }
    );
}

var proccessStem = function (stem, category, l, callback) {
    var catCost = db_connection.collection('catCost');
    var stemCollection = db_connection.collection("stem");
    
    stemCollection.find({ "stem": stem, "count": {"$lt": 250} }).toArray(function(err, objs) {
       if (objs != undefined && objs[0] != undefined && objs[0].count != undefined) {
                        
            var stCount = objs[0].count;
            
            // сколько раз стем встретился в категории
            catCost.find({
                "stem": stem, 
                "cat": category
            }).toArray(function(err, cost) { 
                if (cost.length > 0) {
                    var Nw =  cost[0].count/stCount;
                    var Pwl = (1 - Math.pow(1 - Nw, l));
                    // сколько раз стем НЕ встретился в категории
                    catCost.find({
                        "stem": stem, 
                        "cat": { $ne: category }
                    }).toArray(function(err, cost) { 
                        if (cost.length > 0) {
                             var nPwl = (1 - Math.pow(1 - cost[0].count/stCount, l));
                             var Wwl = Math.log(Pwl/ nPwl)
                             callback(stem, Wwl, Nw);
                        } else {
                            console.log("empty");
                            callback(stem, 0, 0);
                        }
                    })
                } else {
                    console.log("empty");
                    callback(stem, 0, 0);
                }
            })
           
        } else {
            console.log("empty");
            callback(stem, 0, 0);
        }
    });
                
}


exports.Document = Document