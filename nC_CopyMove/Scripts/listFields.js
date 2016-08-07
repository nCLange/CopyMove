System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ListField;
    return {
        setters:[],
        execute: function() {
            class ListField {
                //  content : any;
                constructor(name, type) {
                    this.name = name;
                    this.type = type;
                    console.log(this.name + "//" + this.type);
                    switch (type) {
                        case "User":
                        case "Lookup":
                            this.allowed = false;
                            break;
                        default:
                            this.allowed = true;
                    }
                }
            }
            exports_1("ListField", ListField);
        }
    }
});
//# sourceMappingURL=listfields.js.map