System.register(['./dataservice'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var dataservice_1;
    var ContentType, ItemDL;
    return {
        setters:[
            function (dataservice_1_1) {
                dataservice_1 = dataservice_1_1;
            }],
        execute: function() {
            (function (ContentType) {
                ContentType[ContentType["File"] = 0] = "File";
                ContentType[ContentType["Folder"] = 1] = "Folder";
                ContentType[ContentType["DocSet"] = 2] = "DocSet";
            })(ContentType || (ContentType = {}));
            exports_1("ContentType", ContentType);
            class ItemDL {
                constructor(id, parent) {
                    this.id = id;
                    this.parent = parent;
                    this.dataService = new dataservice_1.DataService();
                    this.contentQueue = [];
                    // this.dataService.getFileAsBufferArray(parent.srcUrl + parent.title, id);
                    this.dataService.getContent(this).then(response => {
                        switch (this.type) {
                            case ContentType.File:
                                this.dataService.readFileToCopy(this).then(response => {
                                    this.dataService.downloadFile(this).then(response => {
                                        this.dataService.createFile(this).then(response => {
                                            this.dataService.fillListItem(this).then(response => { this.dataService.fillListItem(this); }, response => {
                                                console.error("Fill Listitems Failure" + response);
                                            });
                                        }, response => {
                                            console.error("CreateFile Failure" + response);
                                        });
                                    }, response => {
                                        console.error("DownloadFile Failure " + response);
                                    });
                                }, response => {
                                    console.log("readFileToCopy Failure " + response);
                                });
                                break;
                            case ContentType.Folder:
                                this.dataService.getFolder(this).then(response => {
                                    this.dataService.copyFolder(this).then(response => { }, response => { console.log("copyFolder Failure " + response); });
                                }, response => { console.log("getFolder Failure " + response); });
                                break;
                            default:
                                break;
                        }
                    }, response => { "getContent Failure" + response; });
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
                addToQueue(input) {
                    this.contentQueue.push(input);
                }
                releaseQueue() {
                    for (var x = 0; x < this.contentQueue.length; x++) {
                        console.log("Queue Released: " + this.contentQueue[x]);
                        this.parent.addToArray(this.contentQueue[x]);
                    }
                    this.contentQueue = [];
                }
            }
            exports_1("ItemDL", ItemDL);
        }
    }
});
//# sourceMappingURL=itemdl.js.map