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
                constructor(delafter, sitecollections) {
                    this.srcUrl = "http://win-iprrvsfootq/sites/dev";
                    this.selectedItemIds = [1, 2, 23];
                    this.title = "DocaDoca";
                    //  this.targetUrlArray = null;
                    this.folderString = "";
                    for (var i = 0; i < sitecollections.length; i++) {
                        var url;
                        if (sitecollections[i].expanded) {
                            this.targetUrl = sitecollections[i].path;
                            for (var j = 0; j < sitecollections[i].documentLibraries.length; j++) {
                                if (sitecollections[i].documentLibraries[j].expanded) {
                                    this.targetTitle = sitecollections[i].documentLibraries[j].name;
                                    var folder = sitecollections[i].documentLibraries[j];
                                    while (folder.expanded) {
                                        for (var k = 0; k < folder.directories.length; k++) {
                                            if (folder.directories[k].expanded) {
                                                folder = folder.directories[k];
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    console.log("FolderString " + this.folderString);
                    this.items = [];
                    this.deleteAfterwards = delafter;
                    for (var id = 0; id < this.selectedItemIds.length; id++) {
                        this.items.push(new itemdl_1.ItemDL(this.selectedItemIds[id], this));
                    }
                }
                addToArray(id, folderURL, parentFolder) {
                    this.items.push(new itemdl_1.ItemDL(id, this, folderURL, parentFolder));
                    //  console.log("ID:" + id + " folderURL: " + folderURL);
                    //console.log(folderURL);
                }
            }
            exports_1("CopyRoot", CopyRoot);
        }
    }
});
//# sourceMappingURL=copyroot.js.map