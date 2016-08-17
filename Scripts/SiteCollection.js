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
                    var _this = this;
                    this.name = name;
                    this.expanded = false;
                    this.checked = false;
                    this.path = path;
                    this.dataService = new dataservice_1.DataService();
                    this.parent = parent;
                    this.documentLibraries = [];
                    this.visible = true;
                    this.dataService.searchDocumentLibrary2(this.path, this).then(function (response) {
                        var tempresponse;
                        tempresponse = response;
                        _this.documentLibraries = tempresponse;
                    }, function (response) {
                        console.log("Failure " + response);
                    });
                }
                SiteCollection.prototype.toggle = function () {
                    this.expanded = !this.expanded;
                    //   if (this.expanded) {
                    //   }
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