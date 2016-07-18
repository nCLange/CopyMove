System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Directory;
    return {
        setters:[],
        execute: function() {
            class Directory {
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
                toggle() {
                    this.expanded = !this.expanded;
                    if (this.expanded) {
                    }
                }
            }
            exports_1("Directory", Directory);
        }
    }
});
//# sourceMappingURL=directory.js.map