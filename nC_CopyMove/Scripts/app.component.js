System.register(['angular2/core', './treeviewsite', './sitecollection', './documentlibrary', './dataservice'], function(exports_1, context_1) {
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
    var core_1, treeviewsite_1, sitecollection_1, documentlibrary_1, dataservice_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (treeviewsite_1_1) {
                treeviewsite_1 = treeviewsite_1_1;
            },
            function (sitecollection_1_1) {
                sitecollection_1 = sitecollection_1_1;
            },
            function (documentlibrary_1_1) {
                documentlibrary_1 = documentlibrary_1_1;
            },
            function (dataservice_1_1) {
                dataservice_1 = dataservice_1_1;
            }],
        execute: function() {
            let AppComponent = class AppComponent {
                constructor(dataService) {
                    this.dataService = dataService;
                    //  let music = new Directory('Music',[],['song1.mp3','song2.mp3']);
                    let docLib = new documentlibrary_1.DocumentLibrary("Doclib");
                    let ZRR2012 = new sitecollection_1.SiteCollection('ZRR-2014', [docLib, docLib], ['image1.jpg', 'image2.jpg', 'image3.jpg']);
                    let ZRR2013 = new sitecollection_1.SiteCollection('ZRR-2015', [docLib], ['image1.jpg', 'image2.jpg', 'image3.jpg']);
                    let ZRR2014 = new sitecollection_1.SiteCollection('ZRR-2016', [docLib], ['image1.jpg', 'image2.jpg', 'image3.jpg']);
                    let ZRR2015 = new sitecollection_1.SiteCollection('ZRR-2017', [docLib], ['image1.jpg', 'image2.jpg', 'image3.jpg']);
                    let ZRR2016 = new sitecollection_1.SiteCollection('ZRR-2018', [docLib], ['image1.jpg', 'image2.jpg', 'image3.jpg']);
                    this.sitecollection = [ZRR2012, ZRR2013, ZRR2014, ZRR2015, ZRR2016];
                }
            };
            AppComponent = __decorate([
                core_1.Component({
                    selector: "app-main",
                    providers: [dataservice_1.DataService],
                    // template:'<H1>Hello</H1>',
                    template: '<treeviewsite [sitecollection]="sitecollection"></treeviewsite>',
                    //template: '<treeviewsite></treeviewsite>',
                    directives: [treeviewsite_1.TreeViewSite]
                }), 
                __metadata('design:paramtypes', [dataservice_1.DataService])
            ], AppComponent);
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map