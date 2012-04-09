
var ServiceDriver = require("./utils/ras_driver").ServiceDriver;
var Category = require("./models/category").Category;
var Document = require("./models/document").Document;


/**
* Коструктор класс паука, который отвечает за синхронизация и обработку баз 
* @params.proxy_host - если есть прокси сервер, то необходимо указать его настройки
* @params.proxy_port - если есть прокси серевер, то необходимо указать настройки его порта
* @params.delay - задержка в циклах проверки на новую информацию, для паука, задается в милисекундаъs 
*/
var Crawler = function(params) {
  
    this.intervalId = null; // идентификатор основного цикла
    this.categories = new Array(); // список категорий
    this.proccessCount = 0; // количество одновремнно выполняемых запросов
    this.totalProcessCount = 1;
    this.requests = [];
  
    this.options = {
        host: "http://ras.arbitr.ru/",
        headers: {
            Host: "ras.arbitr.ru"
        }
    }
   
    if (params.proxy_host && params.proxy_port) {
        this.options = {
            host: params.proxy_host,
            port: params.proxy_port,
            path: "http://ras.arbitr.ru/",
            headers: {
                Host: "ras.arbitr.ru"
            }
        };      
    }
   
    this.serviceDriver = new ServiceDriver(this.options);

    var self = this;
    this.proccess ({
        proc: function(processEnd) {
            self.serviceDriver.getCategories({
                end: function(data) {
                    processEnd(data);
                }
            })
        },
        end: function(data) {
            var prCount = 0; // всего обновленных категорий
            for(var i=0; i<data.length; i++ ) {
                var cat = new Category({
                    id: data[i].id,
                    name: data[i].name,
                    end: function() {
                        prCount ++;
                        // если обработали все категории
                        if (prCount == data.length) {
                            console.log("Список категорий успешно обновленн!", data.length);
                            self.mainCicle({
                                categories: data
                            });
                        }
                    }
                })
            }
        } 
    });

}

/**
 *  Метод выполнения 
 *  @params.proc - процесс (функция), которая должна быть выполненна
 *  @params.end - после выполенния функции
 */
Crawler.prototype.proccess = function(params) {
    var retVal = []; // Массив данных, которые должен вернуть процесс
    var self = this;
    
    var pr = function() {
        if(self.proccessCount < self.totalProcessCount) {
            self.proccessCount ++;
            params.proc.call(self, function(data){
                self.proccessCount--;
                params.end(data);
            }, params.data);
            
            // если есть таймер
            if (intervalId) {
                clearInterval(intervalId);
            }
            
            return true;
        } else {
            return false;
        }
    }
    
    // если все места заняты, то ждать пока не освободится
    if (!pr()) {
        var intervalId = setInterval(pr, 2000)
    }
}

/**
 * Метод запуска основного цикла 
 * @params.categories - список категорий
 * @params.
 */
Crawler.prototype.mainCicle = function(params) {
    console.log("Получаем список докуметнтов, для всех категории", params.categories.length);
    
    var self = this;
    var documents = [];
    var processCount = 0;
    
    for(var i=0; i<params.categories.length; i++) {

       this.proccess ({
           proc: function(processEnd) {
               self.serviceDriver.getDocumentsList({
                   category: params.categories[i].id,
                   end: function(data) {
                       console.log("Документ для категории " + params.categories[i].id + " найденны!");
                       processEnd(data);
                   },
                   empty: function(){
                      processEnd([]);
                   }
               })
           },
           end: function(data) {
                processCount ++;
                documents.push({
                    category: params.categories[i].id,
                    doc: data
                });
                
                // документы для всех категорий обработанны
                if (processCount == params.categories.length) {
                    for(var j=0; j<documents.length; j++) {
                        if(documents[j].doc.length > 0){
                            self.proccessDocumentsList({
                                documents:  documents[j].doc
                            })
                        }
                    }
                }
                
           }
       });
    }
}

/**
 * Метод обработки списка докуметов 
 */
Crawler.prototype.proccessDocumentsList = function(params) {
    var docData = null;
    for(var p=0; p<params.documents.length; p++) {
        docData = params.documents[p];
        this.proccess ({
            data: docData,
            proc: function(proccessEnd, dc) {
                var dc = new Document({
                    id: dc.id,
                    name : dc.title, 
                    category : dc.category,
                    date: "20.02.2012",
                    service: this.serviceDriver,

                    end: function(doc) {
                       proccessEnd(doc);
                    }
                });
            }, 
            
            end: function(data) {
                console.log("Документ " + data.name + " успешно обработан!");
            }
        })
    }

}

exports.Crawler = Crawler