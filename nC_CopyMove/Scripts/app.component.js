System.register(['angular2/core', './treeviewsite', './dataservice'], function(exports_1, context_1) {
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
            let AppComponent = class AppComponent {
                constructor(dataService) {
                    this.dataService = dataService;
                    //  let music = new Directory('Music',[],['song1.mp3','song2.mp3']);
                    /*  let docLib = new DocumentLibrary("Doclib");
                      let ZRR2012 = new SiteCollection('ZRR-2014', [docLib, docLib], ['image1.jpg', 'image2.jpg', 'image3.jpg']);
                      let ZRR2013 = new SiteCollection('ZRR-2015', [docLib], ['image1.jpg', 'image2.jpg', 'image3.jpg']);
                      let ZRR2014 = new SiteCollection('ZRR-2016', [docLib], ['image1.jpg', 'image2.jpg', 'image3.jpg']);
                      let ZRR2015 = new SiteCollection('ZRR-2017', [docLib], ['image1.jpg', 'image2.jpg', 'image3.jpg']);
                      let ZRR2016 = new SiteCollection('ZRR-2018', [docLib], ['image1.jpg', 'image2.jpg', 'image3.jpg']);
              
                      console.log(dataService.getData());
                      this.sitecollection = [ZRR2012, ZRR2013, ZRR2014, ZRR2015, ZRR2016];
                      */
                    this.sitecollection = [];
                    dataService.searchSiteCollection().then(response => {
                        var tempresponse;
                        tempresponse = response;
                        this.sitecollection = tempresponse;
                        console.log(tempresponse);
                    }, response => {
                        console.log("Failure " + response);
                    });
                }
            };
            AppComponent = __decorate([
                core_1.Component({
                    selector: "app-main",
                    providers: [dataservice_1.DataService],
                    // template:'<H1>Hello</H1>'
                    template: '<tree-view-site [sitecollection]="sitecollection"></tree-view-site>',
                    directives: [treeviewsite_1.TreeViewSite]
                }), 
                __metadata('design:paramtypes', [dataservice_1.DataService])
            ], AppComponent);
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map