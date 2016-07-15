System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SiteCollection;
    return {
        setters:[],
        execute: function() {
            class SiteCollection {
                constructor(name, path = "", files = [""]) {
                    this.name = name;
                    this.files = files;
                    this.documentLibraries = [];
                    this.expanded = false;
                    this.checked = false;
                    this.path = path;
                }
                toggle() {
                    this.expanded = !this.expanded;
                    if (this.expanded) {
                    }
                }
                check() {
                    let newState = !this.checked;
                    this.checked = newState;
                    //      this.checkRecursive(newState);
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