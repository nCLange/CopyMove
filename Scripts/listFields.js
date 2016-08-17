System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ListField;
    return {
        setters:[],
        execute: function() {
            ListField = (function () {
                //  content : any;
                function ListField(name, type) {
                    this.name = name;
                    this.type = type;
                    switch (type) {
                        case "User":
                        case "Lookup":
                        case "URL":
                            this.allowed = false;
                            break;
                        default:
                            this.allowed = true;
                    }
                }
                return ListField;
            }());
            exports_1("ListField", ListField);
        }
    }
});
//# sourceMappingURL=listfields.js.map