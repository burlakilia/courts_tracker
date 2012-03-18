/* 
 * Тестирование получения списка документов
 * 
 */

var http = require("http");

var options = {
  host: 'ras.arbitr.ru',
  port: 80,
  path: '/Ras/Search',
  method: 'POST',
  headers: {
      "Content-Length": 225,
      "Content-Type": "application/json",
      "Referer": "http://ras.arbitr.ru/"
  }
};

var req = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  console.log('HEADERS: ' + JSON.stringify(req.headers));
  
 res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

req.on('error', function(e) {
  console.log("Got error: " + e.message);
});

req.write('{"Page":1,"Count":25,"GroupByCase":false,"DisputeTypes":["5b28d214-b370-4c54-bbc0-fa1adafe90a8"],"DateFrom":"2000-01-01T00:00:00","DateTo":"2030-01-01T23:59:59","Sides":[],"Judges":[],"Cases":[],"Text":"","InstanceType":"-1"}');
    
req.end();