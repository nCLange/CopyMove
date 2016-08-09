System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var FieldContent;
    return {
        setters:[],
        execute: function() {
            class FieldContent {
                constructor(value, field) {
                    switch (field.type) {
                        case "TaxonomyFieldTypeMulti":
                            var terms = new Array();
                            var termValues;
                            for (var i = 0; i < value.get_count(); i++) {
                                terms.push("-1;#" + value.getItemAtIndex(i).get_label() + "|" + value.getItemAtIndex(i).get_termGuid());
                            }
                            //Update
                            this.value = terms.join(";#");
                            this.field = field;
                            break;
                        case "Taxoother":
                            break;
                        case "DateTime":
                            // this.value = new Date(value);
                            this.value = value;
                            this.field = field;
                            break;
                        default:
                            this.value = value;
                            this.field = field;
                    }
                }
            }
            exports_1("FieldContent", FieldContent);
        }
    }
});
//# sourceMappingURL=fieldcontent.js.map