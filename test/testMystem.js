/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var Mystem = require("./../modules/utils/mystem").Mystem;
var mystem = new Mystem();

var text = "Решением Арбитражного суда города Москвы от 14.04.2011 г. по настоящему делу с ОАО «Центр аварийно-спасательных и экологических операций» в пользу заявителя было взыскано 233.000 руб., в том числе: 220.000 руб. неустойки, 13.000 руб. судебных расходов по уплате государственной пошлины. В удовлетворении остальной части заявленных требований судом было отказано. Решение вступило в законную силу, истцом получен исполнительный лист серии АС № 00276398.";
mystem.stemString(text, function(data){
   for(var i=0; i<data.length; i++){
       console.log(i, data[i])
   }
})

