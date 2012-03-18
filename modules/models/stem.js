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
    this.costs = [];
    this.collection = db_connection.collection('stem');
 
    var self = this;

    // проверяем нет ли такой категории в базе
    this.collection.find({stem: self.stem}).toArray(function(err, objects){
        var object;
         if(objects.length == 0) {
            
            self.costs.push({
                category: params.category,
                count: 1
            });
            
            self.collection.insert({
                stem: self.stem,
                costs: self.costs,
                count: 1
            }, 
            { safe:true }, function(err, objects) {

                if (err && !params.error) {
                    console.warn(err.message);
                } else if (params.error) {
                    params.error(err.message);
                } else if (params.end != undefined && typeof params.end == "function") {
                    params.end(objects[0]._id);
                }
            }); // end inserting
        } else {
            
            var newCosts = objects[0].costs;
            var newCount = ++objects[0].count;
            
            for(var i=0; i< newCosts.length; i++ ){
                 if(newCosts[i].category == params.category) {
                    newCosts[i].count++;
                    break;
                }
            } 
            
    
            if (newCosts.length == i) {
                newCosts.push({
                    category: params.category,
                    count: 1
                })
            }
             
            // Обновляем количество вхожденй стемов для данной категории
            self.collection.update({stem: params.stem}, {$set: {costs: newCosts, count: newCount}}, {safe:true},
                function(err) {
                    if (err) {
                        console.warn(err.message);
                    }
                    else if(params.end != undefined && typeof params.end == "function") {
                       params.end(objects[0]._id);
                    }
            });

        }
    });
    
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
                    
                    end: function(stem){
                             
                       if (++proccessStemsCount ==  stems.length){
                            if(params.end != undefined && typeof params.end == "function") {
                                    params.end(retVal);
                            }
                        }
                        
                        retVal.push(stem);
                    } // end end
                });// end retVal.push
            }
            
        });
    }
}


exports.Stem = Stem;
