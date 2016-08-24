System.register(['./directory', './dataservice'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var directory_1, dataservice_1;
    var DocumentLibrary;
    return {
        setters:[
            function (directory_1_1) {
                directory_1 = directory_1_1;
            },
            function (dataservice_1_1) {
                dataservice_1 = dataservice_1_1;
            }],
        execute: function() {
            DocumentLibrary = (function () {
                function DocumentLibrary(name, title, path, parent) {
                    this.name = name;
                    this.title = title;
                    this.selected = false;
                    this.parent = parent;
                    this.relpath = path;
                    // this.cutPath(path);
                    this.expanded = false;
                    this.dataService = new dataservice_1.DataService();
                    this.directories = [];
                    this.visible = true;
                    this.listUrl = "";
                    //  this.directories = [new Directory("thisname",[new Directory("thisbla",[new Directory("thisbla")])])];
                }
                /* cutPath(path) {
                     this.relpath = path.match("(?=" + this.parent.path + ").*?(?=/Form)").toString();
                     this.relpath = this.relpath.substring(this.relpath.lastIndexOf('/') + 1);
             
                    
                 }*/
                DocumentLibrary.prototype.getStyle = function () {
                    if (this.selected) {
                        return "rgba(156, 206, 240, 0.5)";
                    }
                    else {
                        return "white";
                    }
                };
                DocumentLibrary.prototype.toggle = function () {
                    var _this = this;
                    this.expanded = !this.expanded;
                    var tempresponse;
                    if (this.expanded) {
                        this.dataService.searchDirectories(this.parent.path, this.relpath, this).then(function (response) {
                            tempresponse = response;
                            _this.directories = tempresponse;
                        }, function (response) {
                            console.log("Failure " + response);
                        });
                    }
                };
                DocumentLibrary.prototype.select = function (input) {
                    if (input === void 0) { input = null; }
                    if (input == "--1") {
                        directory_1.Directory.selectedPath = "";
                    }
                    this.parent.unsetAll();
                    this.selected = true;
                    DocumentLibrary.targetTitle = this.title;
                    DocumentLibrary.targetName = this.name;
                    DocumentLibrary.srcListUrl = this.listUrl;
                };
                DocumentLibrary.prototype.unsetAll = function () {
                    this.parent.unsetAll();
                };
                return DocumentLibrary;
            }());
            exports_1("DocumentLibrary", DocumentLibrary);
        }
    }
});
//# sourceMappingURL=documentlibrary.js.map