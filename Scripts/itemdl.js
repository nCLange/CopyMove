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
            ItemDL = (function () {
                function ItemDL(id, parent, targetFolderURL, srcFolderURL, parentFolderId) {
                    var _this = this;
                    if (targetFolderURL === void 0) { targetFolderURL = ""; }
                    if (srcFolderURL === void 0) { srcFolderURL = ""; }
                    if (parentFolderId === void 0) { parentFolderId = null; }
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
                    this.name = ".";
                    this.status = "Preparing";
                    // this.title = " ";
                    // this.dataService.getFileAsBufferArray(parent.srcUrl + parent.title, id);
                    //    if (this.incCall() == true) return;
                    this.dataService.getContent(this).then(function (response) {
                        //      this.decCall();
                        switch (_this.type) {
                            case ContentType.File:
                                //    if (this.incCall() == true) return;
                                _this.dataService.readListItem(_this).then(function (response) {
                                    //   this.decCall();
                                    //  if (this.incCall() == true) return;
                                    _this.incCall().then(function (response) {
                                        _this.dataService.soapAjax(_this).then(function (response) {
                                            _this.decCall();
                                            _this.status = "Done";
                                            _this.parent.done(_this, null);
                                        }, function (response) {
                                            _this.decCall();
                                            _this.status = "Error";
                                            _this.parent.done(_this, "File couldn't be copied: " + response);
                                        });
                                    }, function (response) {
                                        _this.decCall();
                                        _this.status = "Error";
                                        _this.parent.done(_this, "Operation Canceled");
                                    });
                                }, function (response) {
                                    //   this.decCall();
                                    _this.status = "Error";
                                    _this.parent.done(_this, "File couldn't be read: " + response);
                                });
                                break;
                            case ContentType.Folder:
                                //  if (this.incCall() == true) return;
                                _this.dataService.getFolder(_this).then(function (response) {
                                    //   this.decCall();
                                    // if (this.incCall() == true) return;
                                    _this.dataService.copyFolder(_this).then(function (response) {
                                        //     this.decCall();
                                        _this.status = "Done";
                                        _this.parent.done(_this, null);
                                    }, function (response) {
                                        //     this.decCall();
                                        _this.status = "Error";
                                        _this.parent.done(_this, "Folder couldn't be copied: " + response);
                                    });
                                }, function (response) {
                                    //     this.decCall();
                                    _this.status = "Error";
                                    _this.parent.done(_this, "Folder couldn't be read: " + response);
                                });
                                break;
                            case ContentType.DocSet:
                                //      if (this.incCall() == true) return;
                                _this.dataService.getFolder(_this).then(function (response) {
                                    // this.decCall();
                                    //  if (this.incCall() == true) return;
                                    _this.dataService.copyDocSet(_this).then(function (response) {
                                        //       this.decCall();
                                        //      if (this.incCall() == true) return;
                                        _this.dataService.readListItem(_this).then(function (response) {
                                            //             this.decCall();
                                            //       if (this.incCall() == true) return;
                                            _this.dataService.fillListItem(_this).then(function (response) {
                                                //                   this.decCall();
                                                // this.dataService.fillListItem(this); // Dunno warum Doppelt
                                                _this.status = "Done";
                                                _this.parent.done(_this, null);
                                            }, function (response) {
                                                //     this.decCall();
                                                _this.status = "Error";
                                                _this.parent.done(_this, "List Fields couldn't be set: " + response);
                                            });
                                        }, function (response) {
                                            //        this.decCall();
                                            _this.status = "Error";
                                            _this.parent.done(_this, "List Fields couldn't be read: " + response);
                                        });
                                    }, function (response) {
                                        //   this.decCall();
                                        _this.status = "Error";
                                        _this.parent.done(_this, "Document Set couldn't be copied: " + response);
                                    });
                                }, function (response) {
                                    //   this.decCall();
                                    _this.status = "Error";
                                    _this.parent.done(_this, "Document Set couldn't be read: " + response);
                                });
                                break;
                            default:
                                // this.decCall();
                                _this.status = "Error";
                                _this.parent.done(_this, "Format is unknown.");
                                break;
                        }
                    }, function (response) {
                        // this.decCall();
                        _this.status = "Error";
                        _this.parent.done(_this, "Couldn't read Content Type: " + response);
                    });
                }
                ItemDL.prototype.addToQueue = function (input) {
                    this.contentQueue.push(input);
                };
                ItemDL.prototype.releaseQueue = function () {
                    for (var x = 0; x < this.contentQueue.length; x++) {
                        // this.parent.addToArray(this.contentQueue[x], this.targetFolderURL, this.parentFolder);
                        this.parent.addToArray(this.contentQueue[x], this.targetFolderURL, this.srcFolderURL, this.parentFolderId);
                    }
                    this.contentQueue = [];
                };
                /*  timeOut(context) {
                      console.log(context.parent.currentCalls+"/"+context.parent.maxCalls);
                      if (context.parent.currentCalls >= context.parent.maxCalls) {
                          console.log("hello");
                          context.status= "Waiting";
                          setTimeout(context.timeOut, 50);
                          return false;
              
                      }
                  }*/
                ItemDL.prototype.waitfor = function () {
                    var that = this;
                    // Check if condition met. If not, re-check later (msec).
                    if (that.parent.currentCalls < that.parent.maxCalls) {
                        return;
                    }
                    else {
                        that.status = "Waiting";
                        // console.log("hello "+that.name);
                        window.setTimeout(that.waitfor, 100);
                    }
                    that.waitfor();
                };
                ItemDL.prototype.waitForPromise = function () {
                    return new Promise(function (resolve, reject) {
                        //let that = this;
                        /*        console.log("5");
                                
                                if (this.parent.currentCalls >= this.parent.maxCalls) {
                                    setTimeout(function () {
                                        console.log("6");
                                        reject();
                                    }, 1000);
                                }
                                else {
                                    console.log("7");
                                    resolve();
                                }*/
                    });
                };
                /* incCall() {
                     if (this.parent.canceled == true) {
                         this.status = "Canceled";
                         return true;
                     }
                     console.log("1");
                     this.waitForPromise().then(
             
                         resolve => {
                             console.log("2");
                             this.parent.currentCalls++;
                             this.status = "Copying";
                             return false;
                         },
                         resolve => {
                             console.log("3");
                             this.status = "Waiting";
                             this.incCall();
                         }
                     );
                     console.log("4");
                     return false;
                 }*/
                ItemDL.prototype.incCall = function () {
                    var outerThat = this;
                    return new Promise(function (resolve, reject) {
                        outerThat.status = "Waiting";
                        inTimeOut();
                        function inTimeOut() {
                            var that = outerThat;
                            if (that.parent.canceled == true) {
                                that.status = "Canceled";
                                reject();
                            }
                            if (that.parent.currentCalls >= that.parent.maxCalls) {
                                setTimeout(function () {
                                    inTimeOut();
                                }, 100);
                            }
                            else {
                                that.parent.currentCalls++;
                                that.status = "Copying";
                                resolve();
                            }
                        }
                        //if (that.parent.currentCalls >= that.parent.maxCalls) {
                        /*   inTimeOut();
            
            
                           setTimeout(function () {
                               that.incCall();
                           }, 100);
                       }
                       else {
                           that.parent.currentCalls++;
                           that.status = "Copying";
                           resolve();
                       }*/
                    });
                };
                ItemDL.prototype.decCall = function () {
                    this.parent.currentCalls--;
                };
                return ItemDL;
            }());
            exports_1("ItemDL", ItemDL);
        }
    }
});
//# sourceMappingURL=itemdl.js.map