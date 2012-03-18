/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var sys = require('sys')
var exec = require('child_process').exec;
var db_connection = require("./db_driver").db_connection;

var Mystem = function (params){
    this.tempFilePath = "/tmp/mystem-temp" // файл с которым работаем
    
    // получаем список игнорируемых стоп слов
    var collection = db_connection.collection('overlookedStem');
    this.overlookedStem = [];
    
    var self = this;
    
    // проверяем нет ли такой категории в базе
    collection.find().toArray(function(err, objects){
        // если для данная категория еще не существует!
        if(objects.length > 0) {
            for(var i=0; i<objects.length; i++) {
                self.overlookedStem.push(objects[i].stem);
            }
        } else {
            this.overlookedStem = ["по","в","c"];
        }
    });
    
}

/**
 * Метод проверки слова, на то что его необходимо пропустить
 * @param stem - провреяемое слово
 * */
Mystem.prototype._isOverlooked = function(stem) {

    for (var i=0; i<this.overlookedStem.length; i++ ) {
        if(this.overlookedStem[i] == stem) {
            return true;
        }
    }
    
    return false;
}

/**
 * Метод обработки строки
 * @param text - текст который должен быть обработан
 * @param callback - функция, которая будет вызвана после обработки текста!
 */
Mystem.prototype.stemString = function(text, callback) {
    var self = this;
    
    // Записываем текст во временный файл
    exec(" echo '" + text + "' | iconv -f utf8 -t cp1251 |  mystem -wl | iconv -f cp1251 -t utf8", function (error, stdout, stderr) {
        
        var stArray = stdout.replace(/{/g, "").split("}");
        var retVal = new Array();
        
        for(var i=0; i<stArray.length; i++) {
        
            var stem = stArray[i];
            var pos = stem.indexOf("|");
             
            if ( pos > 0 ) {
                stem = stem.substr(0, pos);
            }
            if (!self._isOverlooked(stem)) {
                retVal.push(stem);
            }
        }
        
        callback(retVal);

        if (error) {
            console.log("Mystem write file error", error);
        }
    });

}



exports.Mystem = Mystem;