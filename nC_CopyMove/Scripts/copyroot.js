System.register(['./itemdl'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var itemdl_1;
    var CopyRoot;
    return {
        setters:[
            function (itemdl_1_1) {
                itemdl_1 = itemdl_1_1;
            }],
        execute: function() {
            class CopyRoot {
                constructor(delafter) {
                    this.srcUrl = "http://win-iprrvsfootq/sites/dev";
                    this.targetUrl = "http://win-iprrvsfootq/sites/dev";
                    this.selectedItemIds = [1, 2];
                    this.title = "DocaDoca";
                    this.targetTitle = "DocumentTest1";
                    this.items = [];
                    this.deleteAfterwards = delafter;
                    for (var id = 0; id < this.selectedItemIds.length; id++) {
                        // console.log(id);
                        this.items.push(new itemdl_1.ItemDL(this.selectedItemIds[id], this));
                    }
                }
            }
            exports_1("CopyRoot", CopyRoot);
        }
    }
});
//# sourceMappingURL=copyroot.js.map