System.register(["angular2/core"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var ItemExtract;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            let ItemExtract = class ItemExtract {
                constructor() {
                    this.URL = window.location.href;
                    this.ListID = this.URL.substring(this.URL.indexOf("SPListId") + 10, this.URL.lastIndexOf("}"));
                    this.ItemID = this.URL.substring(this.URL.indexOf("SPListItemId") + 13, this.URL.lastIndexOf("&"));
                    this.ItemID = this.ItemID.split(",");
                    console.log(this.ItemID.join());
                    console.log(this.ListID);
                }
                getSelectedItems() {
                    var context = SP.ClientContext.get_current();
                    var list = context.get_web().get_lists().getById(this.ListID);
                    var items = list.getItems;
                }
            };
            ItemExtract = __decorate([
                core_1.Component({
                    selector: 'curlist',
                    template: `<ul><li>List ID: {{ListID}}</li><li>url:{{URL}}</li></ul>`
                }), 
                __metadata('design:paramtypes', [])
            ], ItemExtract);
            exports_1("ItemExtract", ItemExtract);
        }
    }
});
//# sourceMappingURL=ItemExtract.js.map