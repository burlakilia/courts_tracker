/* 
 * Тестирование категории
 */


var Stem = require("./../modules/models/category").Category;

var stem = new Stem({
   name : "Агентирование - Неисполнение или ненадлежащее исполнение обязательств", 
   id : "3c46c4cb-b820-4f8d-8740-15fc744a05a8",
   end: function(category) {
       console.log(category);
   }
});