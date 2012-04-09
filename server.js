var http = require("http");
var url = require("url");
var fs = require('fs');

var router = require('./modules/router');
var actions = require('./actions');
var express = require("express");

var app = express.createServer();

app.use("/public", express.static(__dirname + '/public'));

app.get('/', function(req, res){
    actions.index(res);
});

app.get('/get_main_info', function(req, res){
    actions.get_main_info(res);
})

app.get('/get_categories', function(req, res){
    actions.get_categories(res);
})
var qs = require('querystring');

app.post('/proccessDocument', function(request, response){
    if (request.method == 'POST') {
        var body = '';
        
        request.on('data', function (data) {
            body += data;
            if (body.length > 1e6) {
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                request.connection.destroy();
            }
        });
        request.on('end', function () {

            var params = JSON.parse(body);
           
            console.log(params.text);
            
            var Document = require("./modules/models/document").Document;

            Document.proccess ({
                text: params.text,
                category: params.category,
                end: function(result, stems) {
                    
                    var resp = new Object();
                    resp["result"] = result,
                    resp["stems"] = stems;
                    
                    response.writeHead(200, {'Content-Type': 'text/json'});
                    response.end(JSON.stringify(resp), 'utf-8');

                }
            });

        });
    }
})

app.listen(3000);