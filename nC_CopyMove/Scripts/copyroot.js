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
                    this.targetUrl = "http://win-iprrvsfootq/sites/devsite";
                    this.selectedItemIds = [2];
                    this.title = "DocaDoca";
                    this.targetTitle = "DocumentTest1";
                    this.itemIds = [];
                    this.deleteAfterwards = delafter;
                    for (var id in this.selectedItemIds) {
                        this.itemIds.push(new itemdl_1.ItemDL(id, this));
                    }
                }
            }
            exports_1("CopyRoot", CopyRoot);
        }
    }
});
//# sourceMappingURL=copyroot.js.map