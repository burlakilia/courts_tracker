dojo.provide("courts.CourtsInfo");

dojo.require("dijit.layout.ContentPane");
dojo.require("dijit._Container");
dojo.require("dijit.form.Textarea");
dojo.require("dijit.form.Select");
dojo.require("dijit.form.Button");
    dojo.require("dojo.data.ItemFileReadStore")

dojo.declare("courts.CourtsInfo", [dijit.layout.ContentPane, dijit._Container], {
    
    baseApiUrl: "",
    
    header:  null,
    mainInfo: null,
    mainInfoTemplateString: 
    "<div>"+
    "<div>Документов: ${docsCount}</div>" +  
    "<div>Категорий: 6</div>" +  
    "<div>Стемов:  ${stemsCount}</div>" + 
    "</div>",


    workPlace: null,
    textarea: null,
    startButton: null,
    selectCategory: null,
    
    postCreate  : function(){
        this.inherited (arguments);
        
        this.addChild(this.mainInfo);
        this.addChild(this.workPlace);
        
        this.addChild(this.header);
        
        this.textarea = new dijit.form.Textarea({
            style: "width: 100%;"
        });
        var self = this;
        
        this.startButton = new dijit.form.Button({
            label: "Проверить",
            onClick: function(){
                var params = new Object();
                params["category"] = self.selectCategory.value;
                params["text"] = self.textarea.value;
                
                var xhrArgs = {
                    url: "/proccessDocument",
                    postData: dojo.toJson(params),
                    handleAs: "json",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    load: function(data) {

                    },
                    error: function(error) {

                    }
                }

                var deferred = dojo.xhrPost(xhrArgs);
            }
        });
        
        var catStore = new dojo.data.ItemFileReadStore({
            url: "/get_categories"
        });
        
        this.selectCategory = new dijit.form.Select({
             store: catStore
        });
        
        this.workPlace.addChild(this.selectCategory);
        this.workPlace.addChild(this.textarea);
        this.workPlace.addChild(this.startButton);
        
        this.updateMainInfo();
        
        this.startup();
    },
    
        /**
     * @param _eventId - идентификатор выбранного события
     */
    updateMainInfo: function() {
        var self = this;
        dojo.empty(this.mainInfo.domNode);
	
        var deferred = dojo.xhrGet({
            url: this.baseApiUrl + "/get_main_info",
            handleAs: "json",
             
            load: function(data, response) {
                self.hideLoader();
                console.log(data);
                
                self.mainInfo.containerNode.innerHTML = self.substitute(self.mainInfoTemplateString, {
                    docsCount: data.docsCount,
                    stemsCount: data.stemsCount
                });
		    
                return response;
            },
            error: function(){
                console.log("Connection error!");
            }
        });
       

    },
    
    showLoader: function() {
        dojo.style(dojo.byId("loader"),"display","block")
    },
    
    hideLoader: function() {
        dojo.style(dojo.byId("loader"),"display","none")
    },
    
    // Pushes data into a template - primitive
    substitute: function(template,obj) {
        return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g, function(match,key){
            return obj[key];
        });
    }
    
})

