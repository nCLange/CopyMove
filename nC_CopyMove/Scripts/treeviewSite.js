System.register(["angular2/core", './treeView', './ItemExtract', './targetsites'], function(exports_1, context_1) {
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
    var core_1, treeView_1, ItemExtract_1, targetsites_1;
    var TreeViewSite;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (treeView_1_1) {
                treeView_1 = treeView_1_1;
            },
            function (ItemExtract_1_1) {
                ItemExtract_1 = ItemExtract_1_1;
            },
            function (targetsites_1_1) {
                targetsites_1 = targetsites_1_1;
            }],
        execute: function() {
            let TreeViewSite = class TreeViewSite {
                constructor() {
                    this.target = new targetsites_1.TargetSites();
                }
            };
            __decorate([
                core_1.Input(), 
                __metadata('design:type', Array)
            ], TreeViewSite.prototype, "sitecollection", void 0);
            TreeViewSite = __decorate([
                core_1.Component({
                    selector: 'treeviewsite',
                    templateUrl: './tree-view-site.html',
                    directives: [treeView_1.TreeViewDocLib, ItemExtract_1.ItemExtract]
                }), 
                __metadata('design:paramtypes', [])
            ], TreeViewSite);
            exports_1("TreeViewSite", TreeViewSite);
        }
    }
});
//# sourceMappingURL=treeviewsite.js.map