System.register(['angular2/core', './targetsites'], function(exports_1, context_1) {
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
    var core_1, targetsites_1;
    var TreeViewDocLib;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (targetsites_1_1) {
                targetsites_1 = targetsites_1_1;
            }],
        execute: function() {
            let TreeViewDocLib = class TreeViewDocLib {
                constructor() {
                    this.targetSites = new targetsites_1.TargetSites();
                }
                select(library) {
                    this.selected = !this.selected;
                    if (this.selected) {
                        this.targetSites.searchDocumentLibrary;
                        //gotta subscribe
                        this.documentlibrary = this.targetSites.documentlibraries;
                    }
                    else
                        this.documentlibrary = [];
                }
                getStyle() {
                    if (this.selected) {
                        return "yellow";
                    }
                    else {
                        return "white";
                    }
                }
            };
            __decorate([
                core_1.Input(), 
                __metadata('design:type', Array)
            ], TreeViewDocLib.prototype, "documentlibrary", void 0);
            TreeViewDocLib = __decorate([
                core_1.Component({
                    selector: 'tree-view-doclib',
                    template: `<ul >
                <li [style.background-color]="getStyle()" (click)="select(library)" *ngFor="#library of documentlibrary">{{library.name}}</li>
               </ul>`
                }), 
                __metadata('design:paramtypes', [])
            ], TreeViewDocLib);
            exports_1("TreeViewDocLib", TreeViewDocLib);
        }
    }
});
//# sourceMappingURL=treeView.js.map