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
                    this.name = "";
                    this.status = "";
                    this.title = "";
                    // this.dataService.getFileAsBufferArray(parent.srcUrl + parent.title, id);
                    if (this.incCall() == true)
                        return;
                    this.dataService.getContent(this).then(function (response) {
                        _this.decCall();
                        switch (_this.type) {
                            case ContentType.File:
                                if (_this.incCall() == true)
                                    return;
                                _this.dataService.readListItem(_this).then(function (response) {
                                    _this.decCall();
                                    if (_this.incCall() == true)
                                        return;
                                    _this.dataService.customSoapAjax(_this).then(function (response) {
                                        _this.decCall();
                                        _this.status = "Done";
                                        //     if (this.incCall() == true) return;
                                        _this.parent.done(_this, null);
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
                                    }, function (response) {
                                        _this.decCall();
                                        _this.status = "Error";
                                        _this.parent.done(_this, "File couldn't be copied: " + response);
                                    });
                                }, function (response) {
                                    _this.decCall();
                                    _this.status = "Error";
                                    _this.parent.done(_this, "File couldn't be read: " + response);
                                });
                                break;
                            case ContentType.Folder:
                                if (_this.incCall() == true)
                                    return;
                                _this.dataService.getFolder(_this).then(function (response) {
                                    _this.decCall();
                                    if (_this.incCall() == true)
                                        return;
                                    _this.dataService.copyFolder(_this).then(function (response) {
                                        _this.decCall();
                                        _this.status = "Done";
                                        _this.parent.done(_this, null);
                                    }, function (response) {
                                        _this.decCall();
                                        _this.status = "Error";
                                        _this.parent.done(_this, "Folder couldn't be copied: " + response);
                                    });
                                }, function (response) {
                                    _this.decCall();
                                    _this.status = "Error";
                                    _this.parent.done(_this, "Folder couldn't be read: " + response);
                                });
                                break;
                            case ContentType.DocSet:
                                if (_this.incCall() == true)
                                    return;
                                _this.dataService.getFolder(_this).then(function (response) {
                                    _this.decCall();
                                    if (_this.incCall() == true)
                                        return;
                                    _this.dataService.copyDocSet(_this).then(function (response) {
                                        _this.decCall();
                                        if (_this.incCall() == true)
                                            return;
                                        _this.dataService.readListItem(_this).then(function (response) {
                                            _this.decCall();
                                            if (_this.incCall() == true)
                                                return;
                                            _this.dataService.fillListItem(_this).then(function (response) {
                                                _this.decCall();
                                                // this.dataService.fillListItem(this); // Dunno warum Doppelt
                                                _this.status = "Done";
                                                _this.parent.done(_this, null);
                                            }, function (response) {
                                                _this.decCall();
                                                _this.status = "Error";
                                                _this.parent.done(_this, "List Fields couldn't be set: " + response);
                                            });
                                        }, function (response) {
                                            _this.decCall();
                                            _this.status = "Error";
                                            _this.parent.done(_this, "List Fields couldn't be read: " + response);
                                        });
                                    }, function (response) {
                                        _this.decCall();
                                        _this.status = "Error";
                                        _this.parent.done(_this, "Document Set couldn't be copied: " + response);
                                    });
                                }, function (response) {
                                    _this.decCall();
                                    _this.status = "Error";
                                    _this.parent.done(_this, "Document Set couldn't be read: " + response);
                                });
                                break;
                            default:
                                _this.decCall();
                                _this.status = "Error";
                                _this.parent.done(_this, "Format is unknown.");
                                break;
                        }
                    }, function (response) {
                        _this.decCall();
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
                ItemDL.prototype.timeOut = function () {
                    var that = this;
                    if (that.parent.currentCalls >= that.parent.maxCalls) {
                        that.status = "Waiting";
                        setTimeout(that.timeOut, 50);
                        return false;
                    }
                };
                ItemDL.prototype.incCall = function () {
                    if (this.parent.canceled == true) {
                        this.status = "Canceled";
                        return true;
                    }
                    this.timeOut();
                    this.parent.currentCalls++;
                    this.status = "Copying";
                    return false;
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