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
                constructor(id, parent, targetFolderURL = "", srcFolderURL = "", parentFolderId = null) {
                    this.id = id;
                    this.parent = parent;
                    this.dataService = new dataservice_1.DataService();
                    this.contentQueue = [];
                    this.targetFolderURL = targetFolderURL;
                    this.srcFolderURL = srcFolderURL;
                    //this.parentFolder = parentFolder;
                    this.contentTypeId = null;
                    this.parentFolderId = parentFolderId;
                    this.contents = [];
                    this.name = "";
                    this.status = "";
                    this.title = "";
                    // this.dataService.getFileAsBufferArray(parent.srcUrl + parent.title, id);
                    if (this.incCall() == true)
                        return;
                    this.dataService.getContent(this).then(response => {
                        this.decCall();
                        switch (this.type) {
                            case ContentType.File:
                                if (this.incCall() == true)
                                    return;
                                this.dataService.readListItem(this).then(response => {
                                    this.decCall();
                                    if (this.incCall() == true)
                                        return;
                                    this.dataService.customSoapAjax(this).then(response => {
                                        this.decCall();
                                        this.status = "Done";
                                        //     if (this.incCall() == true) return;
                                        this.parent.done(this, null);
                                        /*  this.dataService.deleteCopySource(this)/*.then(
                                              response => {
                                                  this.status = "Done";
                                                  this.decCall();
                                                  this.parent.done(this, null);
                                              },
                                              response => {
                                                  this.status = "Error";
                                                  this.decCall();
                                                  this.parent.done(this, "Couldn't Delete CopySource: " + response);
                                              }
                                          )
                                      */
                                    }, response => {
                                        this.decCall();
                                        this.status = "Error";
                                        this.parent.done(this, "File couldn't be copied: " + response);
                                    });
                                }, response => {
                                    this.decCall();
                                    this.status = "Error";
                                    this.parent.done(this, "File couldn't be read: " + response);
                                });
                                break;
                            case ContentType.Folder:
                                if (this.incCall() == true)
                                    return;
                                this.dataService.getFolder(this).then(response => {
                                    this.decCall();
                                    if (this.incCall() == true)
                                        return;
                                    this.dataService.copyFolder(this).then(response => {
                                        this.decCall();
                                        this.status = "Done";
                                        this.parent.done(this, null);
                                    }, response => {
                                        this.decCall();
                                        this.status = "Error";
                                        this.parent.done(this, "Folder couldn't be copied: " + response);
                                    });
                                }, response => {
                                    this.decCall();
                                    this.status = "Error";
                                    this.parent.done(this, "Folder couldn't be read: " + response);
                                });
                                break;
                            case ContentType.DocSet:
                                if (this.incCall() == true)
                                    return;
                                this.dataService.getFolder(this).then(response => {
                                    this.decCall();
                                    if (this.incCall() == true)
                                        return;
                                    this.dataService.copyDocSet(this).then(response => {
                                        this.decCall();
                                        if (this.incCall() == true)
                                            return;
                                        this.dataService.readListItem(this).then(response => {
                                            this.decCall();
                                            if (this.incCall() == true)
                                                return;
                                            this.dataService.fillListItem(this).then(response => {
                                                this.decCall();
                                                // this.dataService.fillListItem(this); // Dunno warum Doppelt
                                                this.status = "Done";
                                                this.parent.done(this, null);
                                            }, response => {
                                                this.decCall();
                                                this.status = "Error";
                                                this.parent.done(this, "List Fields couldn't be set: " + response);
                                            });
                                        }, response => {
                                            this.decCall();
                                            this.status = "Error";
                                            this.parent.done(this, "List Fields couldn't be read: " + response);
                                        });
                                    }, response => {
                                        this.decCall();
                                        this.status = "Error";
                                        this.parent.done(this, "Document Set couldn't be copied: " + response);
                                    });
                                }, response => {
                                    this.decCall();
                                    this.status = "Error";
                                    this.parent.done(this, "Document Set couldn't be read: " + response);
                                });
                                break;
                            default:
                                this.decCall();
                                this.status = "Error";
                                this.parent.done(this, "Format is unknown.");
                                break;
                        }
                    }, response => {
                        this.decCall();
                        this.status = "Error";
                        this.parent.done(this, "Couldn't read Content Type: " + response);
                    });
                }
                addToQueue(input) {
                    this.contentQueue.push(input);
                }
                releaseQueue() {
                    for (var x = 0; x < this.contentQueue.length; x++) {
                        // this.parent.addToArray(this.contentQueue[x], this.targetFolderURL, this.parentFolder);
                        this.parent.addToArray(this.contentQueue[x], this.targetFolderURL, this.srcFolderURL, this.parentFolderId);
                    }
                    this.contentQueue = [];
                }
                timeOut() {
                    let that = this;
                    if (this.parent.currentCalls >= this.parent.maxCalls) {
                        this.status = "Waiting";
                        setTimeout(that.timeOut, 50);
                        return false;
                    }
                }
                incCall() {
                    if (this.parent.canceled == true) {
                        this.status = "Canceled";
                        return true;
                    }
                    this.timeOut();
                    this.parent.currentCalls++;
                    this.status = "Copying";
                    return false;
                }
                decCall() {
                    this.parent.currentCalls--;
                }
            }
            exports_1("ItemDL", ItemDL);
        }
    }
});
//# sourceMappingURL=itemdl.js.map