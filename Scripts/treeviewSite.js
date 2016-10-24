System.register(["@angular/core", './treeView', './copyroot', './filterpipe', './dataservice'], function(exports_1, context_1) {
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
    var core_1, treeView_1, copyroot_1, filterpipe_1, dataservice_1;
    var TreeViewSite;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (treeView_1_1) {
                treeView_1 = treeView_1_1;
            },
            function (copyroot_1_1) {
                copyroot_1 = copyroot_1_1;
            },
            function (filterpipe_1_1) {
                filterpipe_1 = filterpipe_1_1;
            },
            function (dataservice_1_1) {
                dataservice_1 = dataservice_1_1;
            }],
        execute: function() {
            TreeViewSite = (function () {
                function TreeViewSite() {
                    this.searchValue = null;
                    this.initialSet = false;
                    this.counter = 0;
                    this.loading = false;
                    this.displaySiteCol = [];
                    this.screen = 0;
                    this.filesToCopy = null;
                    this.errorReport = null;
                    this.moved = false;
                    this.dataService = new dataservice_1.DataService();
                }
                TreeViewSite.prototype.ngAfterViewChecked = function () {
                    if (this.initialSet == false) {
                        if (this.sitecollection && this.sitecollection.length > 0) {
                            this.displaySiteCol = this.sitecollection;
                            this.initialSet = true;
                        }
                    }
                };
                TreeViewSite.prototype.canceled = function () {
                    this.screen = 0;
                    this.copyroot.canceled = true;
                };
                TreeViewSite.prototype.clicked = function (delafter) {
                    this.moved = delafter;
                    this.screen = 1;
                    this.copyroot = new copyroot_1.CopyRoot(delafter, this);
                    this.filesToCopy = this.copyroot.items;
                    this.errorReport = this.copyroot.errorReport;
                };
                TreeViewSite.prototype.done = function () {
                    window.parent.location.reload(true);
                };
                TreeViewSite.prototype.filterResult = function (inputText) {
                    var _this = this;
                    if (!inputText || inputText.length < 3) {
                        this.counter++;
                        this.displaySiteCol = this.sitecollection;
                        this.loading = false;
                        return;
                    }
                    this.displaySiteCol = [];
                    this.counter++;
                    this.loading = true;
                    this.dataService.searchDocLibFilter(this, inputText, this.counter).then(function (response) {
                        if (response[0] != _this.counter)
                            return;
                        _this.loading = false;
                        _this.displaySiteCol = response[1];
                    }, function (response) {
                        console.log("Error SearchDocLibFilter");
                        if (response[0] != _this.counter)
                            return;
                        _this.loading = false;
                    });
                    console.log(inputText);
                };
                TreeViewSite.prototype.unsetAll = function () {
                    this.selected = true;
                    for (var i = 0; i < this.displaySiteCol.length; i++) {
                        for (var j = 0; j < this.displaySiteCol[i].documentLibraries.length; j++) {
                            this.displaySiteCol[i].documentLibraries[j].selected = false;
                            for (var k = 0; k < this.displaySiteCol[i].documentLibraries[j].directories.length; k++) {
                                this.displaySiteCol[i].documentLibraries[j].directories[k].unsetAll();
                            }
                        }
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], TreeViewSite.prototype, "searchValue", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], TreeViewSite.prototype, "sitecollection", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], TreeViewSite.prototype, "selected", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', String)
                ], TreeViewSite.prototype, "errorSiteCol", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], TreeViewSite.prototype, "filesToCopy", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], TreeViewSite.prototype, "errorReport", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Boolean)
                ], TreeViewSite.prototype, "moved", void 0);
                TreeViewSite = __decorate([
                    core_1.Component({
                        selector: 'tree-view-site',
                        templateUrl: './tree-view-site.html',
                        directives: [treeView_1.TreeViewDocLib],
                        pipes: [filterpipe_1.SiteColPipe]
                    }), 
                    __metadata('design:paramtypes', [])
                ], TreeViewSite);
                return TreeViewSite;
            }());
            exports_1("TreeViewSite", TreeViewSite);
        }
    }
});
//# sourceMappingURL=treeviewsite.js.map