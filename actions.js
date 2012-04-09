var fs = require('fs');

var Document = require("./modules/models/document").Document;
var Category = require("./modules/models/category").Category;
var Stem = require("./modules/models/stem").Stem;

function index(response, postData) {
    fs.readFile('./public/index.html', function(error, content) {
        if (error) {
            response.writeHead(500);
            response.end();
        }
        else {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(content, 'utf-8');
        }
    }); 
} 

function getMainInfo(response, postData) {
    var resp = new Object();
    Document.getDocumentsCount({
        end: function(count) {
            resp["docsCount"] = count;
            Stem.getStemsCount({
                end: function(count) {
                    resp["stemsCount"] = count;
                    response.writeHead(200, {'Content-Type': 'text/json'});
                    response.end(JSON.stringify(resp), 'utf-8');
                }
            })
           
        },
        error: function(error) {
            response.writeHead(500);
            response.end();
        }
    })
}

function getCategories (response, postData) {
    Category.getActive({
        end: function(data) {
            var resp = new Object();
            resp["identifier"] = "id",
            resp["label"] = "name",
            resp["items"] = data
            
            response.writeHead(200, {'Content-Type': 'text/json'});
            response.end(JSON.stringify(resp), 'utf-8');
        }
    })
}

function proccessDocument(response, postData) {
    console.log(postData)
}

exports.index = index;
exports.get_main_info = getMainInfo;
exports.get_categories = getCategories;

