/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
db.system.js.remove({"_id":"getActiveCategories"});
db.system.js.save({
    "_id": "getActiveCategories",
    "value": function () {
        var catCount = db.category.find().toArray();
        var retVal = [];

        for(var i=0; i<catCount.length; i++) {

            if (db.catCost.find({"doc": catCount[i].id}).count() > 0) {
                retVal.push(catCount[i]);
            }

        }

        return retVal;
    }
});

