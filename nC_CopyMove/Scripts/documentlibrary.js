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
            class DocumentLibrary {
                constructor(name, path, parent) {
                    this.name = name;
                    this.selected = false;
                    this.parent = parent;
                    this.relpath = path;
                    // this.cutPath(path);
                    this.expanded = false;
                    this.dataService = new dataservice_1.DataService();
                    this.directories = [];
                    //  this.directories = [new Directory("thisname",[new Directory("thisbla",[new Directory("thisbla")])])];
                }
                /* cutPath(path) {
                     this.relpath = path.match("(?=" + this.parent.path + ").*?(?=/Form)").toString();
                     this.relpath = this.relpath.substring(this.relpath.lastIndexOf('/') + 1);
             
                    
                 }*/
                getStyle() {
                    if (this.selected) {
                        return "#BEC9FF";
                    }
                    else {
                        return "white";
                    }
                }
                toggle() {
                    this.expanded = !this.expanded;
                    var tempresponse;
                    if (this.expanded) {
                        this.dataService.searchDirectories(this.parent.path, this.relpath, this).then(response => {
                            tempresponse = response;
                            this.directories = tempresponse;
                            console.log(tempresponse);
                        }, response => {
                            console.log("Failure " + response);
                        });
                    }
                }
                select(input = null) {
                    if (input == "--1") {
                        directory_1.Directory.selectedPath = "";
                    }
                    this.parent.unsetAll();
                    this.selected = true;
                    DocumentLibrary.targetTitle = this.name;
                }
                unsetAll() {
                    this.parent.unsetAll();
                }
            }
            exports_1("DocumentLibrary", DocumentLibrary);
        }
    }
});
//# sourceMappingURL=documentlibrary.js.map