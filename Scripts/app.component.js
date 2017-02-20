System.register(['@angular/core', './treeviewsite', './dataservice'], function(exports_1, context_1) {
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
    var core_1, treeviewsite_1, dataservice_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (treeviewsite_1_1) {
                treeviewsite_1 = treeviewsite_1_1;
            },
            function (dataservice_1_1) {
                dataservice_1 = dataservice_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(dataService) {
                    var _this = this;
                    this.dataService = dataService;
                    this.errorSiteCol = "";
                    this.sitecollection = [];
                    dataService.searchSiteCollection(this).then(function (response) {
                        var tempresponse;
                        tempresponse = response;
                        _this.sitecollection = tempresponse;
                        if (_this.sitecollection.length == 0)
                            _this.errorSiteCol = "Couldn't find any Site Collections";
                    }, function (response) {
                        console.log("Failure " + response);
                        _this.errorSiteCol = "Failure with the search API: " + response;
                    });
                }
                AppComponent.prototype.unsetAll = function () {
                    this.selected = true;
                    for (var i = 0; i < this.sitecollection.length; i++) {
                        for (var j = 0; j < this.sitecollection[i].documentLibraries.length; j++) {
                            this.sitecollection[i].documentLibraries[j].selected = false;
                            for (var k = 0; k < this.sitecollection[i].documentLibraries[j].directories.length; k++) {
                                this.sitecollection[i].documentLibraries[j].directories[k].unsetAll();
                            }
                        }
                    }
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: "app-main",
                        providers: [dataservice_1.DataService],
                        // template:'<H1>Hello</H1>'
                        template: '<tree-view-site [sitecollection]="sitecollection" [selected]="selected" [errorSiteCol]="errorSiteCol"></tree-view-site>',
                        directives: [treeviewsite_1.TreeViewSite]
                    }), 
                    __metadata('design:paramtypes', [dataservice_1.DataService])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map