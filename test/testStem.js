/*
 * Тестирование работы mystem
 */
var Mystem = require("./../modules/utils/mystem").Mystem;
var Stem = require("./../modules/models/stem").Stem;

var params =  {
    text: "март апрель май март суд суд февраль март",
    category: "3c46c4cb-b820-4f8d-8740-15fc744a05a8",
    document: "1234",
    end: function(data) {
       for(var i=0; i<data.length; i++){
            console.log(i, data[i])
       }
    }
}

Stem.steming(params)
