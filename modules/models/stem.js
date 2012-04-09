/* 
 * Описание модели стемма
 */
var Mystem = require("./../utils/mystem").Mystem;
var db_connection = require("./../utils/db_driver").db_connection;

/**
 * Конструктор объект стемма
 * @params.stem - словоформа
 * @params.documentId - документ, куда добовлять новые стеммы
 * @params.end - функция обратного вызова
 */
var Stem = function(params) {   
    this.stem = params.stem;
    this.id = params.stem;
    this.document = params.document;
    this.category = params.category;
    
    this.docCost = 1; // стоимость стем для данного документа
    this.catCost = 1; // стоимость стема для данной категории

    if (params.end != undefined && typeof params.end == "function") {
        params.end.call(this);
    }
}

Stem.prototype.updateStem = function (callback) {
     
    var collection = db_connection.collection('stem');
    var self = this;
    
    collection.find({"stem": this.stem}).toArray(function(err, obj){
       console.log(self.stem, obj.length);
       if(obj.length == 0) {
           collection.insert({"stem": self.stem, "count":self.docCost}, {safe:false},
                function(err) {
                    if (err) {
                        console.warn(err.message);
                    }
                    else if (callback != undefined && typeof callback == "function") {
                        self.updateCosts({
                            end: function() { callback() } 
                        });
                    } 
            });
       } else {
            collection.update({"stem": self.stem}, {$inc: {count: + self.docCost}}, {safe:false},
                function(err) {
                    if (err) {
                        console.warn(err.message);
                    }
                    else if (callback != undefined && typeof callback == "function") {
                        self.updateCosts({
                            end: function() { callback() } 
                        });
                    } 
            });
              
       }
    });
}

Stem.prototype.updateCosts = function(params){
    var self = this;
    
    self.updateDocCosts({
        document: params.document,
        end: function() {

            self.updateCatCosts({
                category: params.category,
                end: function() {
                    if(params.end != undefined && typeof params.end == "function") {
                        params.end(params.stem);
                    }
                }
            })
        }
    })
}

/**
 * Метод обновления количества, вхождений стемма в документ
 * @params.document - идентификатор документа
 * @params.end - функция обратного вызова при завершений
 */
Stem.prototype.updateDocCosts = function(params) {
    var collection = db_connection.collection('docCost');
    var self = this;
    
    collection.find({doc: self.document}).toArray(function(err, objects){
         if (objects.length == 0){
            collection.insert({
                stem: self.stem,
                doc: self.document,
                count: self.docCost
            }, 
            {safe:false}, function(err, objects) {
                if (params.end != undefined && typeof params.end == "function") {
                    params.end();
                }
            })
        } else {
            collection.update({stem: self.stem, doc:self.document}, {$inc: {count: +self.docCost }}, {safe:false},
                function(err) {
                    if (err) {
                        console.warn(err.message);
                    }
                    else if (params.end != undefined && typeof params.end == "function") {
                            params.end();
                    } 
            });
        }
    })
}

/**
 * Метод обновления количества, вхождений стемма в категорию
 * @params.document - идентификатор документа
 * @params.end - функция обратного вызова при завершений
 */
Stem.prototype.updateCatCosts = function(params) {
     var collection = db_connection.collection('catCost');
     var self = this;
     
     collection.find({stem: this.stem, cat: self.category}).toArray(function(err, objects){
        if (objects.length == 0){
            collection.insert({
                stem: self.stem,
                cat: self.category,
                count: self.docCost
            }, 
            {safe:true}, function(err, objects) {
                if (params.end != undefined && typeof params.end == "function") {
                    params.end();
                }
            })
        } else {
            collection.update({stem: self.stem, cat:self.category}, {$inc: {count: self.docCost}}, {safe:true},
                function(err) {
                    if (err) {
                        console.warn(err.message);
                    }
                    else if (params.end != undefined && typeof params.end == "function") {
                            params.end();
                    } 
            });
        }
    })
}

/**
 * Метод стемминга текста и обновления данных о стемме
 * @params.text - текст, который необходим отстемить
 * @params.category - идентификатор категории к которой относится текст
 * @parasm.onItem - события, которое происходит
 * @params.end - функция обратного вызова, в качестве параметра, будет передан массив ссылок на созданные или существуюище стемыы!
 */
Stem.steming = function (params) {
    var stem = new Mystem();
    
    var proccessStemsCount = 0; // сколько всего стемов обработанно
    
    if (params.text != undefined) {
        stem.stemString(params.text, function(stems) {
            var retVal = new Array();
            
            for (var i=0; i<stems.length; i++) {
                var st = new Stem({
                    stem: stems[i], 
                    category: params.category,
                    document: params.document,
                    
                    end: function(){
                        
                        var findStem = function (_st) {
                            for(var j=0; j<retVal.length; j++) {
                                if(retVal[j].stem == _st) {
                                    return j;
                                }
                            }
                            
                            return retVal.length;
                        };
                        
                        var num = findStem(this.stem);

                        if (num == retVal.length){
                            retVal.push(this);
                        } else {  
                            retVal[num].docCost ++;
                        }
                        
                        if (proccessStemsCount == stems.length - 1 && params.end != undefined && typeof params.end == "function"){
                            
                            var updateStemsCount = 0;
                            
                            // обновляем стемы в базеd
                            for(var k=0; k< retVal.length; k++ ){ 
                                retVal[k].updateStem(function() {
                                    if (++updateStemsCount == retVal.length) {
                                        params.end(retVal);
                                    }
                                });
                            }  
                        } 
                            
                        proccessStemsCount++;
                            
                    } // end end
                });// end retVal.push
            }
            
        });
    }
}


/**
 * Метод получения списка документов по заданным параметрам
 */
Stem.getStemsCount = function (params) {
    this.collection = db_connection.collection('stem');
    
    this.collection.find().toArray(function(err, objects) {
        if (params.end != undefined && typeof params.end == "function") {
            params.end(objects.length);
        }
    })
}

exports.Stem = Stem;
