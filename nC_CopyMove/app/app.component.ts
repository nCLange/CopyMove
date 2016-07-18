import {Component} from 'angular2/core';
import {TreeViewSite} from './treeviewsite';
import {SiteCollection} from './sitecollection';
import {DocumentLibrary} from './documentlibrary';
import {DataService} from './dataservice';


@Component({
    selector: "app-main",
    providers: [DataService],
    // template:'<H1>Hello</H1>'
    template: '<tree-view-site [sitecollection]="sitecollection"></tree-view-site>',
    directives: [TreeViewSite]
})

export class AppComponent {
    sitecollection: Array<SiteCollection>;
    constructor(private dataService: DataService) {
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
        dataService.searchSiteCollection().then(
            response => {
                var tempresponse;
                tempresponse = response;
                this.sitecollection = tempresponse;
                console.log(tempresponse);
            }, response => {
                console.log("Failure " + response);
            });
    }
}