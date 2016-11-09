System.register(['@angular/core', './dataservice'], function(exports_1, context_1) {
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
    var core_1, dataservice_1;
    var SiteColPipe;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (dataservice_1_1) {
                dataservice_1 = dataservice_1_1;
            }],
        execute: function() {
            SiteColPipe = (function () {
                function SiteColPipe() {
                    this.dataService = new dataservice_1.DataService();
                }
                SiteColPipe.prototype.transform = function (value, args) {
                    var dossierName = args;
                    if (args == null)
                        return value;
                    //NEW
                    if (dossierName.length < 3)
                        return value;
                    /*  this.dataService.searchDocLibFilter(this,dossierName).then(
                          response => { },
                          response => { }
                      )*/
                    //  this.dataService.searchDocLibFilterObservable(this,dossierName);
                    /*  return value.filter(site => {
                          (site as SiteCollection).expanded = false;
                          (site as SiteCollection).visible = false;
              
                          if (dossierName.length < 3) {
                              (site as SiteCollection).visible = true;
                              (site as SiteCollection).expanded = false;
                          }
                          
                          for (var i = 0; i < (site as SiteCollection).documentLibraries.length; i++) {
                              if (dossierName.length < 3) {
                                  (site as SiteCollection).documentLibraries[i].visible = true;
                                  continue;
                              }
                              //console.log((site as SiteCollection).documentLibraries[i].name+"---"+dossierName);
                              if ((site as SiteCollection).documentLibraries[i].title.toLowerCase().includes(dossierName.toLowerCase())) {
                                  (site as SiteCollection).documentLibraries[i].visible = true;
                                  if (dossierName != "")
                                      (site as SiteCollection).expanded = true;
                                  (site as SiteCollection).visible = true;
                              }
                              else {
                                  (site as SiteCollection).documentLibraries[i].visible = false;
                              }
                          }
                          
                         // if ((site as SiteCollection).visible == true)
                              return site;
                      });*/
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