System.register(['@angular/core', './treeviewdirectory'], function(exports_1, context_1) {
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
    var core_1, treeviewdirectory_1;
    var TreeViewDocLib;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (treeviewdirectory_1_1) {
                treeviewdirectory_1 = treeviewdirectory_1_1;
            }],
        execute: function() {
            TreeViewDocLib = (function () {
                function TreeViewDocLib() {
                }
                TreeViewDocLib.prototype.select = function (library) {
                    var that = this;
                    this.dblclick = false;
                    setTimeout(function () {
                        // console.log(this.dblclick);
                        if (that.dblclick == false)
                            library.toggle();
                    }, 400);
                };
                TreeViewDocLib.prototype.mark = function (library) {
                    this.dblclick = true;
                    library.select("--1");
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], TreeViewDocLib.prototype, "documentlibrary", void 0);
                TreeViewDocLib = __decorate([
                    core_1.Component({
                        selector: 'tree-view-doclib',
                        template: "<ul class=\"libList\">\n                <div *ngFor=\"let library of documentlibrary\">\n                    <div *ngIf=\"library.visible==true\">\n                        <li class=\"libListElements\">\n                            <div [style.background-color]=\"library.getStyle()\" (dblclick)=\"mark(library)\" (click)=\"select(library)\">\n                                <img src=\"../images/dossiers.svg\" width=\"16\" height=\"16\">&nbsp;{{library.title}}\n                            </div>\n                            <div *ngIf=\"library.expanded\">\n                                <tree-view-directory [folderLookUp]=\"library\"></tree-view-directory>\n                            </div>\n                        </li>\n                    </div>\n                </div>\n               </ul>",
                        directives: [treeviewdirectory_1.TreeViewDirectory],
                    }), 
                    __metadata('design:paramtypes', [])
                ], TreeViewDocLib);
                return TreeViewDocLib;
            }());
            exports_1("TreeViewDocLib", TreeViewDocLib);
        }
    }
});
//# sourceMappingURL=treeView.js.map