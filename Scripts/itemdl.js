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
                    this.contentTypeId = null;
                    this.parentFolderId = parentFolderId;
                    this.contents = [];
                    this.name = ".";
                    this.status = "Preparing";
                    //  this.parent.fileAmount++;
                    this.dataService.getContent(this).then(function (response) {
                        switch (_this.type) {
                            case ContentType.File:
                                _this.dataService.readListItem(_this).then(function (response) {
                                    _this.ready().then(function (response) {
                                        _this.status = "Preparing Copying";
                                    }, function (response) {
                                        if (response == "Cancel") {
                                            _this.status = "Canceled";
                                            _this.parent.done(_this, null);
                                        }
                                        else {
                                            _this.parent.hasError = true;
                                            _this.status = "Error";
                                            _this.parent.done(_this, response);
                                        }
                                    });
                                }, function (response) {
                                    _this.parent.hasError = true;
                                    _this.status = "Error";
                                    _this.parent.done(_this, "File couldn't be read: " + response);
                                });
                                break;
                            case ContentType.Folder:
                                _this.dataService.getFolder(_this).then(function (response) {
                                    _this.ready().then(function (response) {
                                        _this.status = "Preparing Copying";
                                    }, function (response) {
                                        if (response == "Cancel") {
                                            _this.status = "Canceled";
                                            _this.parent.done(_this, null);
                                        }
                                        else {
                                            _this.parent.hasError = true;
                                            _this.status = "Error";
                                            _this.parent.done(_this, response);
                                        }
                                    });
                                }, function (response) {
                                    //     this.decCall();
                                    _this.parent.hasError = true;
                                    _this.status = "Error";
                                    _this.parent.done(_this, "Folder couldn't be read: " + response);
                                });
                                break;
                            case ContentType.DocSet:
                                _this.dataService.getFolder(_this).then(function (response) {
                                    _this.ready().then(function (response) {
                                        _this.status = "Preparing Copying";
                                    }, function (response) {
                                        if (response == "Cancel") {
                                            _this.status = "Canceled";
                                            _this.parent.done(_this, null);
                                        }
                                        else {
                                            _this.status = "Error";
                                            _this.parent.hasError = true;
                                            _this.parent.done(_this, response);
                                        }
                                    });
                                }, function (response) {
                                    //   this.decCall();
                                    _this.parent.hasError = true;
                                    _this.status = "Error";
                                    _this.parent.done(_this, "Document Set couldn't be read: " + response);
                                });
                                break;
                            default:
                                // this.decCall();
                                _this.parent.hasError = true;
                                _this.status = "Error";
                                _this.parent.done(_this, "Format is unknown.");
                                break;
                        }
                    }, function (response) {
                        // this.decCall();
                        _this.parent.hasError = true;
                        _this.status = "Error";
                        _this.parent.done(_this, "Couldn't read Content Type: " + response);
                    });
                }
                ItemDL.prototype.readyToCopy = function () {
                    var _this = this;
                    this.incCall().then(function (response) {
                        _this.status = "Copying";
                        switch (_this.type) {
                            case ContentType.File:
                                _this.dataService.soapAjax(_this).then(function (response) {
                                    _this.decCall();
                                    _this.status = "Done";
                                    _this.parent.done(_this, null);
                                }, function (response) {
                                    _this.decCall();
                                    _this.parent.hasError = true;
                                    _this.status = "Error";
                                    _this.parent.done(_this, "File couldn't be copied: " + response);
                                });
                                break;
                            case ContentType.Folder:
                                _this.dataService.copyFolder(_this).then(function (response) {
                                    _this.decCall();
                                    _this.status = "Done";
                                    _this.releaseQueue();
                                    _this.parent.done(_this, null);
                                }, function (response) {
                                    _this.decCall();
                                    _this.parent.hasError = true;
                                    _this.status = "Error";
                                    _this.parent.done(_this, "Folder couldn't be copied: " + response);
                                });
                                break;
                            case ContentType.DocSet:
                                _this.dataService.copyDocSetByName(_this).then(function (response) {
                                    _this.dataService.readListItem(_this).then(function (response) {
                                        _this.dataService.fillListItem(_this).then(function (response) {
                                            _this.decCall();
                                            _this.status = "Done";
                                            _this.releaseQueue();
                                            _this.parent.done(_this, null);
                                        }, function (response) {
                                            _this.decCall();
                                            _this.parent.hasError = true;
                                            _this.status = "Error";
                                            _this.parent.done(_this, "List Fields couldn't be set: " + response);
                                        });
                                    }, function (response) {
                                        _this.decCall();
                                        _this.parent.hasError = true;
                                        _this.status = "Error";
                                        _this.parent.done(_this, "List Fields couldn't be read: " + response);
                                    });
                                }, function (response) {
                                    //   this.decCall();
                                    _this.decCall();
                                    _this.parent.hasError = true;
                                    _this.status = "Error";
                                    _this.parent.done(_this, "Document Set couldn't be copied: " + response);
                                });
                                break;
                        }
                    }, function (response) {
                        _this.decCall();
                        _this.parent.hasError = true;
                        _this.status = "Error";
                        _this.parent.done(_this, "Operation Canceled");
                    });
                };
                ItemDL.prototype.addToQueue = function (input) {
                    // this.contentQueue.push(input);
                    this.contentQueue.push(this.parent.addToArray(input, this.targetFolderURL, this.srcFolderURL, this.parentFolderId));
                };
                ItemDL.prototype.releaseQueue = function () {
                    for (var x = 0; x < this.contentQueue.length; x++) {
                        //  this.parent.addToArray(this.contentQueue[x], this.targetFolderURL, this.srcFolderURL, this.parentFolderId);
                        this.contentQueue[x].readyToCopy();
                    }
                    this.contentQueue = [];
                };
                ItemDL.prototype.ready = function () {
                    var outerthat = this;
                    this.status = "Ready";
                    this.parent.readCounter++;
                    return new Promise(function (resolve, reject) {
                        var fullURL = outerthat.parent.targetUrl + "/" + outerthat.parent.targetName + "/" + outerthat.targetFolderURL + outerthat.name;
                        fullURL = fullURL.replace(window.location.protocol + "//" + window.location.host, "");
                        fullURL = decodeURIComponent(fullURL);
                        if (fullURL.length > 260) {
                            outerthat.parent.hasError = true;
                            outerthat.status = "Error";
                            reject("Targeturl of the item is " + (fullURL.length - 260) + " signs too long");
                            return;
                        }
                        inTimeOut2();
                        function inTimeOut2() {
                            var that = outerthat;
                            if (that.parent.hasError) {
                                that.status = "Canceled";
                                reject("Cancel");
                            }
                            else if (that.parent.readCounter >= that.parent.items.length) {
                                if (that.parent.rootItems.indexOf(that) != -1) {
                                    that.readyToCopy();
                                }
                                // that.status="Ready";
                                resolve();
                            }
                            else {
                                setTimeout(function () {
                                    inTimeOut2();
                                }, 1000);
                            }
                        }
                    });
                };
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