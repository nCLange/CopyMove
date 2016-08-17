System.register(['@angular/core'], function(exports_1, context_1) {
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
    var SiteColPipe;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            SiteColPipe = (function () {
                function SiteColPipe() {
                }
                SiteColPipe.prototype.transform = function (value, args) {
                    var dossierName = args;
                    if (args == null)
                        return value;
                    return value.filter(function (site) {
                        site.expanded = false;
                        site.visible = false;
                        for (var i = 0; i < site.documentLibraries.length; i++) {
                            //console.log((site as SiteCollection).documentLibraries[i].name+"---"+dossierName);
                            if (site.documentLibraries[i].name.toLowerCase().includes(dossierName.toLowerCase())) {
                                site.documentLibraries[i].visible = true;
                                if (dossierName != "")
                                    site.expanded = true;
                                site.visible = true;
                            }
                            else {
                                site.documentLibraries[i].visible = false;
                            }
                        }
                        if (site.visible == true)
                            return site;
                    });
                };
                SiteColPipe = __decorate([
                    core_1.Pipe({
                        name: 'SiteColFilter'
                    }),
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], SiteColPipe);
                return SiteColPipe;
            }());
            exports_1("SiteColPipe", SiteColPipe);
        }
    }
});
//# sourceMappingURL=filterpipe.js.map