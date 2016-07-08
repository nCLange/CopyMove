System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var DocumentLibrary;
    return {
        setters:[],
        execute: function() {
            class DocumentLibrary {
                constructor(name) {
                    this.name = name;
                    this.selected = false;
                }
                getStyle() {
                    if (this.selected) {
                        return "yellow";
                    }
                    else {
                        return "";
                    }
                }
            }
            exports_1("DocumentLibrary", DocumentLibrary);
        }
    }
});
//# sourceMappingURL=documentlibrary.js.map