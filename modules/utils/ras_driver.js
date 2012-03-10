/* 
 * Реализация драйвера для доступа к данным с сервиса ras.arbitr.ru
 * */

var http = require("http");

var ServiceDriver = function(options) {
    this.options = options;
}


/**
 * Метод получения списка решений, с сервера и в его внутреннем формате!
 * @param !TODO добавить параметры выбокри
 * @param.end(JSON object) - функция обратного вызова, при успешном получения документв
 */
ServiceDriver.prototype.getDocumentsList = function (params) {
            
    var data = "";
    console.log(this.options);
    
    request = http.request(this.options, function(response){
        
        console.log('STATUS: ' + response.statusCode);
        console.log(response.headers);
        console.log(this.options);
        
        response.setEncoding('utf8');
        
        response.on("data", function(chunk) {
            data += chunk 
        });

        response.on("end", function() {
            console.log(data)
        });

        response.on("error", function(error) {
            console.log("Error" + error); 
        });
    });
    
    //request.end(post_data);
  
    /*console.log(request);
    // Набор взят непосредственно с сайтf
    var data = '{"Message":"","Success":true,"ServerDate":"\/Date(1329853019630)\/","Result":{"PagesCount":40,"TotalCount":190230,"NumOnPage":25,"Page":1,"ReturnCount":1000,"Items":[{"Id":"e0fde9d5-b86a-489e-94fe-62b509a49d0b","CaseId":"d3af03fb-8f2a-4312-8cfe-1bcffb2e6013","RegistrationDate":"24.12.2012","InstanceNumber":"А11-12428/2011","CaseNumber":"А11-12428/2011","FileName":"А11-12428-2011__20121224.pdf","InstanceLevel":1,"Court":"АС Владимирской области","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0},{"Id":"9db00768-4be2-4c96-859c-594f50044822","CaseId":"37b9a422-0e9e-4790-ba9e-75aaf86fe6b2","RegistrationDate":"18.12.2012","InstanceNumber":"А11-11587/2011","CaseNumber":"А11-11587/2011","FileName":"А11-11587-2011__20121218.pdf","InstanceLevel":1,"Court":"АС Владимирской области","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0},{"Id":"1b3b3165-57c8-4df5-88ec-a56c84d89d24","CaseId":"c445de25-be29-4b1c-a2ea-2529a8bddefb","RegistrationDate":"10.10.2012","InstanceNumber":"А11-9543/2011","CaseNumber":"А11-9543/2011","FileName":"А11-9543-2011__20121010.pdf","InstanceLevel":1,"Court":"АС Владимирской области","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0},{"Id":"2aed13a3-ea3f-4fc8-863b-4f71bcec4d75","CaseId":"6abc64bf-15d6-41fa-ba9b-e9768ce51d8f","RegistrationDate":"07.06.2012","InstanceNumber":"А11-12392/2011","CaseNumber":"А11-12392/2011","FileName":"А11-12392-2011__20120607.pdf","InstanceLevel":1,"Court":"АС Владимирской области","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0},{"Id":"6aab64e9-228a-47fe-89f4-3bd1b8d71c67","CaseId":"fa0bce59-7cbf-4b96-be6a-35fbf1f4ef97","RegistrationDate":"01.06.2012","InstanceNumber":"А40-20542/2010","CaseNumber":"А40-20542/2010","FileName":"А40-20542-2010__20120601.pdf","InstanceLevel":1,"Court":"АС города Москвы","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"475df74b-3561-4d85-88fd-da5ca39fa722","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить частично"],"DocumentCount":0},{"Id":"c4b971c6-19db-453e-b515-c604be059e5a","CaseId":"dd67630c-e8c0-4ba5-b1ce-f448c8d4d484","RegistrationDate":"24.02.2012","InstanceNumber":"А27-16649/2011","CaseNumber":"А27-16649/2011","FileName":"А27-16649-2011__20120224.pdf","InstanceLevel":1,"Court":"АС Кемеровской области","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0},{"Id":"958be74d-aeba-4598-8011-e1d186833f64","CaseId":"d4118291-9a79-4feb-b4bc-c73f8ac88369","RegistrationDate":"22.02.2012","InstanceNumber":"А27-20943/2011","CaseNumber":"А27-20943/2011","FileName":"А27-20943-2011__20120222.pdf","InstanceLevel":1,"Court":"АС Кемеровской области","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0},{"Id":"646a6bf2-2802-4a8a-a90f-75f5ba29987d","CaseId":"385e9c4f-1a37-4c3a-957a-d22ebaee9382","RegistrationDate":"21.02.2012","InstanceNumber":"А40-133832/2011","CaseNumber":"А40-133832/2011","FileName":"А40-133832-2011__20120221.pdf","InstanceLevel":1,"Court":"АС города Москвы","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0},{"Id":"5bebc68f-7cec-41d8-b186-3e12c34f8c6d","CaseId":"dddb611a-ecb8-4f69-8d94-afc7e414590e","RegistrationDate":"21.02.2012","InstanceNumber":"А40-135003/2011","CaseNumber":"А40-135003/2011","FileName":"А40-135003-2011__20120221.pdf","InstanceLevel":1,"Court":"АС города Москвы","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0},{"Id":"1c06e12b-337a-48df-90c6-d42e861c7bc4","CaseId":"d4b2d434-eb74-4455-9184-db3fca2df4ee","RegistrationDate":"21.02.2012","InstanceNumber":"А40-121496/2011","CaseNumber":"А40-121496/2011","FileName":"А40-121496-2011__20120221.pdf","InstanceLevel":1,"Court":"АС города Москвы","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0},{"Id":"3f7eb929-1e61-43c5-878e-d79f70f88b2a","CaseId":"7ced4f5c-5b59-4a2f-982a-a4e4f858ecb8","RegistrationDate":"21.02.2012","InstanceNumber":"А40-132113/2011","CaseNumber":"А40-132113/2011","FileName":"А40-132113-2011__20120221.pdf","InstanceLevel":1,"Court":"АС города Москвы","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"2d75b7fc-450b-4ae6-ae75-61a3ea5a825a","ContentTypes":["Решение суда первой инстанции","В иске отказать полностью"],"DocumentCount":0},{"Id":"c08f122f-4950-4568-90fd-999e99235048","CaseId":"8d654757-8477-4f58-a1aa-8fa67446afea","RegistrationDate":"21.02.2012","InstanceNumber":"А40-132810/2011","CaseNumber":"А40-132810/2011","FileName":"А40-132810-2011__20120221.pdf","InstanceLevel":1,"Court":"АС города Москвы","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0},{"Id":"673d057d-6abf-4456-9c7f-a882a8116e94","CaseId":"44017eb7-ca70-45d5-9e1b-1cd9bc0a3eda","RegistrationDate":"21.02.2012","InstanceNumber":"А40-4794/2012","CaseNumber":"А40-4794/2012","FileName":"А40-4794-2012__20120221.pdf","InstanceLevel":1,"Court":"АС города Москвы","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0},{"Id":"c64d228f-b852-44e9-8b28-ab50716d4b4b","CaseId":"9b9c0c20-518e-408a-a42f-137fba74e804","RegistrationDate":"21.02.2012","InstanceNumber":"А40-133289/2011","CaseNumber":"А40-133289/2011","FileName":"А40-133289-2011__20120221.pdf","InstanceLevel":1,"Court":"АС города Москвы","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0},{"Id":"4b0593a9-d7eb-41de-b3cb-06e223628dde","CaseId":"4c9e9b04-b822-429d-9c4e-694c5eea7b11","RegistrationDate":"21.02.2012","InstanceNumber":"А60-43232/2011","CaseNumber":"А60-43232/2011","FileName":"А60-43232-2011__20120221.pdf","InstanceLevel":1,"Court":"АС Свердловской области","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0},{"Id":"442d9cf2-33f1-49f2-9c15-1cde4173b3c1","CaseId":"96ccf943-cd12-4dc7-bcfa-bc5fee8cd0c4","RegistrationDate":"21.02.2012","InstanceNumber":"А40-134447/2011","CaseNumber":"А40-134447/2011","FileName":"А40-134447-2011__20120221.pdf","InstanceLevel":1,"Court":"АС города Москвы","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0},{"Id":"063f1981-353d-4f70-84dd-660e347a5b6b","CaseId":"4867c4db-2342-4928-8296-f376b6646ef4","RegistrationDate":"21.02.2012","InstanceNumber":"А40-112290/2011","CaseNumber":"А40-112290/2011","FileName":"А40-112290-2011__20120221.pdf","InstanceLevel":1,"Court":"АС города Москвы","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"2d75b7fc-450b-4ae6-ae75-61a3ea5a825a","ContentTypes":["Решение суда первой инстанции","В иске отказать полностью"],"DocumentCount":0},{"Id":"98b9b678-9676-4598-9025-9510ab082f7d","CaseId":"4a37f016-2940-4ae8-8397-d1290c0e197b","RegistrationDate":"21.02.2012","InstanceNumber":"А41-45599/2011","CaseNumber":"А41-45599/2011","FileName":"А41-45599-2011__20120221.pdf","InstanceLevel":1,"Court":"АС Московской области","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"475df74b-3561-4d85-88fd-da5ca39fa722","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить частично"],"DocumentCount":0},{"Id":"322d9658-c05a-475a-9641-8875e4bf1f36","CaseId":"a142ddd3-c82d-4c37-9c9f-aa3b79668c60","RegistrationDate":"21.02.2012","InstanceNumber":"А40-15305/2012","CaseNumber":"А40-15305/2012","FileName":"А40-15305-2012__20120221.pdf","InstanceLevel":1,"Court":"АС города Москвы","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0},{"Id":"91ed1a82-c807-4fe5-b3f3-8a66ce941cea","CaseId":"d4663517-5197-4ae4-9dca-158fd9887dc4","RegistrationDate":"21.02.2012","InstanceNumber":"А41-45627/2011","CaseNumber":"А41-45627/2011","FileName":"А41-45627-2011__20120221.pdf","InstanceLevel":1,"Court":"АС Московской области","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0},{"Id":"59e0a668-a0a4-47cc-bdc9-1921eaf5adac","CaseId":"b7171d04-c575-4378-b471-2d784747e08c","RegistrationDate":"21.02.2012","InstanceNumber":"А40-129324/2011","CaseNumber":"А40-129324/2011","FileName":"А40-129324-2011__20120221.pdf","InstanceLevel":1,"Court":"АС города Москвы","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0},{"Id":"fed21f04-2285-4ef7-b063-701ec60356a5","CaseId":"f082abc0-27a3-4c10-b125-9a2d159f3967","RegistrationDate":"21.02.2012","InstanceNumber":"А40-132176/2011","CaseNumber":"А40-132176/2011","FileName":"А40-132176-2011__20120221.pdf","InstanceLevel":1,"Court":"АС города Москвы","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0},{"Id":"5b501b9c-8462-49cf-9874-c13c5eb4cb7e","CaseId":"6594ae20-a902-449c-a097-51ff2cbd15cd","RegistrationDate":"21.02.2012","InstanceNumber":"А40-133113/2011","CaseNumber":"А40-133113/2011","FileName":"А40-133113-2011__20120221.pdf","InstanceLevel":1,"Court":"АС города Москвы","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0},{"Id":"1824e69a-70ed-428a-ae2f-9ac2416ebae7","CaseId":"eb5d839e-e3cd-46b5-acd0-048e287b011f","RegistrationDate":"21.02.2012","InstanceNumber":"А40-135180/2011","CaseNumber":"А40-135180/2011","FileName":"А40-135180-2011__20120221.pdf","InstanceLevel":1,"Court":"АС города Москвы","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0},{"Id":"7e7a0287-5e9d-436b-9e63-6bf21b54ded8","CaseId":"0c3f98a4-5f55-4d50-9337-ca401f8fc556","RegistrationDate":"21.02.2012","InstanceNumber":"А40-132937/2011","CaseNumber":"А40-132937/2011","FileName":"А40-132937-2011__20120221.pdf","InstanceLevel":1,"Court":"АС города Москвы","Type":"Решения и постановления","KodeksId":0,"ContentTypesString":"1c35af3f-06d5-4b90-b4be-5a3c4148d8be","DecisionTypeId":"ca17ae6e-adb5-453a-8fc1-e54d7a39dd1b","ContentTypes":["Решение суда первой инстанции","Иск удовлетворить полностью"],"DocumentCount":0}]}}'
    
    if (params.end && typeof params.end == "function") {
        var docs = JSON.parse(data);
        params.end(docs);
    }*/
}

/**
 * Метод получения текста документа
 * @params.id - идентификатор документа во внешней системе
 * @params.end(String) - метод который будет вызван после успешного получения текста
 * @params.error(String) - функция обработки ошибок
 */
ServiceDriver.prototype.getDocumentText = function(params) {
    if (!params.id) {
        if(params.error) {
            params.error("Не задан идетификатор документа!");
        } else {
            console.error("Не задан идентификатор документа!");
        }    
    } else {

        this.options.path = "http://ras.arbitr.ru/HtmlDocument/" + params.id,
        http.get(this.options, function(response) {
            
            var data = "";
            
            response.setEncoding('utf8');
        
            response.on("data", function(chunk) {
                data += chunk 
            });

            response.on("end", function() {
                if (!params.end) {
                    console.error("Функция обратного вызова для данных не определенна!");
                } else { 
                    params.end(data);
                }
            });

            response.on("error", function(error) {
                console.log("Error" + error); 
            });
        });
    }
}

ServiceDriver.prototype.getCategories = function(params) {
    // получаем и обновляем список категории

    http.get(this.options, function(response) {

        var data = "";

        response.setEncoding('utf8');

        response.on("data", function(chunk) {
            data += chunk 
        });

        response.on("end", function() {
            if (params.end && typeof params.end == "function") {
                params.end.call(this, data);
            }
        });

        response.on("error", function(error) {
            console.log("Error" + error); 
        });
    });
}

exports.ServiceDriver = ServiceDriver;