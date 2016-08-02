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
            class SiteCollection {
                constructor(name, path, parent) {
                    this.name = name;
                    this.expanded = false;
                    this.checked = false;
                    this.path = path;
                    this.dataService = new dataservice_1.DataService();
                    this.parent = parent;
                    this.documentLibraries = [];
                }
                toggle() {
                    this.expanded = !this.expanded;
                    if (this.expanded) {
                        this.dataService.searchDocumentLibrary2(this.path, this).then(response => {
                            var tempresponse;
                            tempresponse = response;
                            this.documentLibraries = tempresponse;
                            console.log(tempresponse);
                        }, response => {
                            console.log("Failure " + response);
                        });
                    }
                }
                check() {
                    let newState = !this.checked;
                    this.checked = newState;
                    //      this.checkRecursive(newState);
                }
                unsetAll() {
                    this.parent.unsetAll();
                }
            }
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