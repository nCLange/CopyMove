System.register(['./dataservice'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var dataservice_1;
    var ItemDL;
    return {
        setters:[
            function (dataservice_1_1) {
                dataservice_1 = dataservice_1_1;
            }],
        execute: function() {
            class ItemDL {
                constructor(id, parent) {
                    this.id = id;
                    this.parent = parent;
                    this.dataService = new dataservice_1.DataService();
                    // this.dataService.getFileAsBufferArray(parent.srcUrl + parent.title, id);
                    this.dataService.copyFile(this);
                    /*      this.dataService.getElementById(parent.srcUrl, parent.title, 1,parent).then(
                              response => {
                                  var tempresponse;
                                  tempresponse = response;
                                 // this.itemList = tempresponse;
                              }, response => {
                                  console.log("Failure " + response);
                              });
                          */
                }
            }
            exports_1("ItemDL", ItemDL);
        }
    }
});
//# sourceMappingURL=itemdl.js.map