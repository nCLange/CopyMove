System.register(['./dataservice'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var dataservice_1;
    var SiteCollection;
    return {
        setters:[
            function (dataservice_1_1) {
                dataservice_1 = dataservice_1_1;
            }],
        execute: function() {
            SiteCollection = (function () {
                function SiteCollection(name, path, parent) {
                    this.gotSearched = false;
                    this.name = name;
                    this.expanded = false;
                    this.checked = false;
                    this.path = path;
                    this.dataService = new dataservice_1.DataService();
                    this.parent = parent;
                    this.documentLibraries = [];
                    this.visible = true;
                    /*
                            this.dataService.searchDocumentLibrary2(this.path,this).then(
                                    response => {
                                        var tempresponse;
                                        tempresponse = response;
                                        this.documentLibraries = tempresponse;
                                    }, response => {
                                        console.log("Failure " + response);
                                    });
                    */
                }
                SiteCollection.prototype.toggle = function () {
                    var _this = this;
                    this.expanded = !this.expanded;
                    if (this.expanded && this.gotSearched == false) {
                        this.dataService.searchDocumentLibrary3(this.path, this).then(function (response) {
                            var tempresponse;
                            tempresponse = response;
                            _this.documentLibraries = tempresponse;
                            _this.gotSearched = true;
                        }, function (response) {
                            console.log("Failure " + response);
                        });
                    }
                };
                SiteCollection.prototype.check = function () {
                    var newState = !this.checked;
                    this.checked = newState;
                    //      this.checkRecursive(newState);
                };
                SiteCollection.prototype.unsetAll = function () {
                    SiteCollection.targetPath = this.path;
                    this.parent.unsetAll();
                };
                SiteCollection.prototype.createDocLib = function (guid) {
                    var _this = this;
                    this.dataService.getDocLibInfo(this, this.path, guid).then(function (response) {
                        _this.documentLibraries.push(response);
                        _this.documentLibraries.sort(function (a, b) { return a.title.toLowerCase().localeCompare(b.title.toLowerCase()); });
                    }, function (response) { console.log(response); });
                    //  this.documentLibraries.push(new DocumentLibrary(path,title,junk,this));
                    this.expanded = true;
                    this.visible = true;
                    this.gotSearched = true;
                };
                return SiteCollection;
            }());
            exports_1("SiteCollection", SiteCollection);
        }
    }
});
// checkRecursive(state){
//     this.documentLibraries.forEach(d => {
//         d.checked = state;
//         d.checkRecursive(state);
//     })
// } 
//# sourceMappingURL=sitecollection.js.map