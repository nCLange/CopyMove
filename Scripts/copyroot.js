System.register(['./dataservice', './itemdl', './sitecollection', './documentlibrary', './directory'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var dataservice_1, itemdl_1, sitecollection_1, documentlibrary_1, directory_1;
    var CopyRoot;
    return {
        setters:[
            function (dataservice_1_1) {
                dataservice_1 = dataservice_1_1;
            },
            function (itemdl_1_1) {
                itemdl_1 = itemdl_1_1;
            },
            function (sitecollection_1_1) {
                sitecollection_1 = sitecollection_1_1;
            },
            function (documentlibrary_1_1) {
                documentlibrary_1 = documentlibrary_1_1;
            },
            function (directory_1_1) {
                directory_1 = directory_1_1;
            }],
        execute: function() {
            CopyRoot = (function () {
                function CopyRoot(delafter, /*sitecollections: Array<SiteCollection>,*/ parent) {
                    var _this = this;
                    this.errorReport = [];
                    this.targetUrl = sitecollection_1.SiteCollection.targetPath;
                    this.targetTitle = documentlibrary_1.DocumentLibrary.targetTitle;
                    this.targetName = documentlibrary_1.DocumentLibrary.targetName;
                    this.srcListUrl = documentlibrary_1.DocumentLibrary.srcListUrl;
                    this.targetRootPath = "";
                    this.rootFolder = null;
                    this.dataService = new dataservice_1.DataService();
                    this.maxCalls = 3;
                    this.currentCalls = 0;
                    this.srcUrl = _spPageContextInfo.webAbsoluteUrl;
                    this.fields = [];
                    this.canceled = false;
                    this.items = [];
                    this.doneCounter = 0;
                    this.parent = parent;
                    this.delafter = delafter;
                    this.srcListId = new RegExp('[\?&]SPListId=([^&#]*)').exec(window.location.href)[1];
                    // var wat = new RegExp('[\?&]SPListURL=([^&#]*)').exec(window.location.href)[1];
                    var tempItemIds = new RegExp('[\?&]SPListItemId=([^&#]*)').exec(window.location.href);
                    this.selectedItemIds = tempItemIds[1].split(",").map(Number);
                    this.dataService.getListInfoFromId(this).then(function (response) {
                        _this.dataService.getListPermission(_this.srcUrl, _this.srcListId, false).then(function (response) {
                            if (!response.has(SP.PermissionKind.viewListItems)) {
                                _this.cancel("Keine Berechtigung den Listeninhalt in der Quellbibliothek zu lesen");
                                return;
                            }
                            if (!response.has(SP.PermissionKind.deleteListItems) && _this.delafter) {
                                _this.cancel("Keine Berechtigung die Listenelemente in der Quellbibliothek zu löschen");
                                return;
                            }
                            _this.dataService.getListPermission(_this.targetUrl, _this.targetTitle, true).then(function (response) {
                                if (!response.has(SP.PermissionKind.viewListItems)) {
                                    _this.cancel("Keine Berechtigung den Listeninhalt in der Zielbibliothek zu lesen");
                                    return;
                                }
                                if (!response.has(SP.PermissionKind.addListItems)) {
                                    _this.cancel("Keine Berechtigung die Listenelemente in der Zielbibliothek zu erstellen");
                                    return;
                                }
                                if (!response.has(SP.PermissionKind.editListItems)) {
                                    _this.cancel("Keine Berechtigung die Listenelemente in der Zielbibliothek zu editieren");
                                    return;
                                }
                                _this.srcRootPath = _this.srcRootPath.replace(_spPageContextInfo.siteServerRelativeUrl + "/" + _this.name, "");
                                if (_this.srcRootPath != "") {
                                    _this.srcRootPath += "/";
                                    _this.srcRootPath = _this.srcRootPath.substr(1, _this.srcRootPath.length);
                                }
                                //           console.log(this.srcRootPath);
                                if (directory_1.Directory.selectedPath != undefined && directory_1.Directory.selectedPath != "" && directory_1.Directory.selectedPath != null) {
                                    _this.targetRootPath = directory_1.Directory.selectedPath;
                                    _this.dataService.getFolderFromUrl(_this).then(function (response) {
                                        //  this.items = [];
                                        //    this.deleteAfterwards = delafter;
                                        for (var id = 0; id < _this.selectedItemIds.length; id++) {
                                            _this.items.push(new itemdl_1.ItemDL(_this.selectedItemIds[id], _this, _this.targetRootPath, _this.srcRootPath, _this.rootFolder.get_listItemAllFields().get_id()));
                                        }
                                    }, function (response) { console.log("getFolderFromUrl Error " + response); });
                                }
                                else {
                                    //   this.items = [];
                                    //  this.deleteAfterwards = delafter;
                                    for (var id = 0; id < _this.selectedItemIds.length; id++) {
                                        _this.items.push(new itemdl_1.ItemDL(_this.selectedItemIds[id], _this, "", _this.srcRootPath));
                                    }
                                }
                            }, function (response) {
                                console.log("getPermissionErrorTarget " + response);
                            });
                        }, function (response) { console.log("getPermissionErrorSrc " + response); });
                    }, function (response) {
                        console.log("getListInfoFromIdError" + response);
                    });
                }
                CopyRoot.prototype.addToArray = function (id, targetFolderURL, srcFolderURL, parentFolderId) {
                    this.items.push(new itemdl_1.ItemDL(id, this, targetFolderURL, srcFolderURL, parentFolderId));
                };
                CopyRoot.prototype.done = function (caller, errorMsg) {
                    if (errorMsg != null && errorMsg != "") {
                        this.errorReport.push(caller.name + ": " + errorMsg);
                    }
                    /*  for(var i=0; i<20; i++)
                            this.errorReport.push(i+" Hello");*/
                    this.doneCounter++;
                    if (this.doneCounter >= this.items.length) {
                        if (this.delafter) {
                            var error = false;
                            for (var i = this.items.length - 1; i >= 0; i--) {
                                if (this.items[i].status == "Done" && this.items[i].type == itemdl_1.ContentType.File) {
                                    this.items[i].dataService.deleteEntry(this.items[i]);
                                }
                                else if (this.items[i].status != "Done" && this.items[i].type == itemdl_1.ContentType.File) {
                                    error = true;
                                }
                                else if (this.items[i].status == "Done" && this.items[i].type != itemdl_1.ContentType.File) {
                                    if (error == false)
                                        this.items[i].dataService.deleteEntry(this.items[i]);
                                }
                                else {
                                    error = true;
                                }
                            }
                        }
                        this.parent.screen = 2;
                    }
                };
                CopyRoot.prototype.cancel = function (errorMsg) {
                    if (errorMsg != null && errorMsg != "") {
                        this.errorReport.push(errorMsg);
                    }
                    this.parent.screen = 2;
                };
                return CopyRoot;
            }());
            exports_1("CopyRoot", CopyRoot);
        }
    }
});
//# sourceMappingURL=copyroot.js.map