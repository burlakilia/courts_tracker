
var ServiceDriver = require("./utils/ras_driver").ServiceDriver;
var libxmljs = require("libxmljs");
var Category = require("./models/category").Category;
var Document = require("./models/document").Document;

var RequestQuery = function() {
    
    this.lastRequestNumber = 0; // номер последнего запроса  
    this.queries = [];
};

RequestQuery.prototype.addQuery = function(query) {
    
};

/**
* Коструктор класс паука, который отвечает за синхронизация и обработку баз 
* @params.proxy_host - если есть прокси сервер, то необходимо указать его настройки
* @params.proxy_port - если есть прокси серевер, то необходимо указать настройки его порта
* @params.delay - задержка в циклах проверки на новую информацию, для паука, задается в милисекундаъs 
*/
var Crawler = function(params) {
  
   this.intervalId = null; // идентификатор основного цикла
   this.categories = new Array(); // список категорий
   this.queries = new RequestQuery();
   
   this.serviceDriver = new ServiceDriver(this.options);

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
        }};      
   }

   Crawler.refreshCategories.call(this, {
       end: function() {
            // Context Crawler object
            console.log("start main cicle");
            var self = this;
            
            // Запускаем основной цикл нашего паучка
            this.intervalId = setInterval(function(params) {
                Crawler.mainCicle.call(self);
                clearInterval(self.intervalId)
            }, 1000 ); 
       }
   });
 
 
}

/**
* Метод получения списка категорий и сохранения их в базе
* @params.end() - метод который будет вызван после завершения обработки
*/
Crawler.refreshCategories = function(params) {
    var self = this;
    GLOBAL.SERVICE.getCategories({
        end: function(data) {
            var xmlDoc = libxmljs.parseHtmlString(data);
            var categories = xmlDoc.get('//div[@id="caseCategory"]/span/label/select');
            
            categories.childNodes().forEach(function(item){
                if (item.attr("value")) {
                    // пробуем создать категорию
                    self.categories.push(new Category({
                        id:  item.attr("value").value(),
                        name: item.text()
                    }));
                }
            }, this)
            
            if (params.end && typeof params.end == "function") {
                params.end.call(self);
            }
        }
    });
}

/**
 * Метод обновления данных о документах
 * @params.category - категория, для которой обнолвяется сипсок документов
 */
Crawler.refreshDocuments = function(params) {
    var self = this;
    GLOBAL.SERVICE.getDocumentsList({
        category: params.category,
        end: function(list) {
            var items = list.Result.Items;
            for(var i=0; i< items.length; i++){
                var _item = items[i];
                GLOBAL.SERVICE.getDocumentText({
                    id: _item.Id,
                    end: function(data) {
                        console.log("Документ " + _item.InstanceNumber + "  запущен в обработку")       
                    },
                    error: function(error) {
                        console.error(error);
                    }
                });
            }
        },
        
        empty: function() {}
    });
}
/**
 * Основной цикл паука
 * Context Crawler object
 */
Crawler.mainCicle = function() {
    var db_connection = require("./utils/db_driver").db_connection;
    this.collection = db_connection.collection('category');
    this.collection.find().each(function(err, objects) {
        if (objects != undefined && objects.id != undefined) {
            Crawler.refreshDocuments({
                category: objects.id
            });
        }
    });

}

exports.Crawler = Crawler