System.register(['./dataservice', './documentlibrary'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var dataservice_1, documentlibrary_1;
    var Directory;
    return {
        setters:[
            function (dataservice_1_1) {
                dataservice_1 = dataservice_1_1;
            },
            function (documentlibrary_1_1) {
                documentlibrary_1 = documentlibrary_1_1;
            }],
        execute: function() {
            class Directory {
                constructor(name, parent) {
                    this.name = name;
                    this.selected = false;
                    this.parent = parent;
                    this.dataService = new dataservice_1.DataService();
                    this.relpath = this.getRelUrl();
                    this.absolutePath = this.getAbsolutePath();
                    this.directories = [];
                }
                getStyle() {
                    if (this.selected) {
                        return "#BEC9FF";
                    }
                    else {
                        return "";
                    }
                }
                getRelUrl() {
                    if (this.parent instanceof documentlibrary_1.DocumentLibrary) {
                        return this.parent.relpath + "/" + this.name;
                    }
                    else {
                        return this.parent.getRelUrl() + "/" + this.name;
                    }
                }
                getAbsolutePath() {
                    if (this.parent instanceof documentlibrary_1.DocumentLibrary)
                        return this.parent.parent.path;
                    else
                        return this.parent.getAbsolutePath();
                }
                toggle() {
                    this.expanded = !this.expanded;
                    if (this.expanded) {
                        this.dataService.searchDirectories(this.absolutePath, this.relpath, this).then(response => {
                            var tempresponse;
                            tempresponse = response;
                            this.directories = tempresponse;
                        }, response => {
                            console.log("Failure " + response);
                        });
                    }
                }
                select(name) {
                    //   this.parent.unsetAll();
                    if (name == "--1") {
                        Directory.selectedPath = "";
                    }
                    this.parent.select(this.selected);
                    this.selected = true;
                    Directory.selectedPath = Directory.selectedPath + this.name + "/";
                }
            }
            exports_1("Directory", Directory);
        }
    }
});
//# sourceMappingURL=directory.js.map