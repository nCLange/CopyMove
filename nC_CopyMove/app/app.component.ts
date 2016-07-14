import {Component} from 'angular2/core';
import {TreeViewSite} from './treeviewsite';
import {SiteCollection} from './sitecollection';
import {DocumentLibrary} from './documentlibrary';
import {DataService} from './dataservice';
import {TargetSites} from './targetSites';


@Component({
    selector: "app-main",
    providers: [DataService],
   // template:'<H1>Hello</H1>',
    template: '<treeviewsite [doclibs]="doclibs"></treeviewsite>',
    //template: '<treeviewsite></treeviewsite>',
    directives: [TreeViewSite]
})

export class AppComponent {
    sitecollection: Array<SiteCollection>;
    doclibs: Array<DocumentLibrary>;
    targetsites: TargetSites;
   /* constructor(private dataService: DataService) {
        //  let music = new Directory('Music',[],['song1.mp3','song2.mp3']);
        let docLib = new DocumentLibrary("Doclib");
        let ZRR2012 = new SiteCollection('ZRR-2014', [docLib, docLib], ['image1.jpg', 'image2.jpg', 'image3.jpg']);
        let ZRR2013 = new SiteCollection('ZRR-2015', [docLib], ['image1.jpg', 'image2.jpg', 'image3.jpg']);
        let ZRR2014 = new SiteCollection('ZRR-2016', [docLib], ['image1.jpg', 'image2.jpg', 'image3.jpg']);
        let ZRR2015 = new SiteCollection('ZRR-2017', [docLib], ['image1.jpg', 'image2.jpg', 'image3.jpg']);
        let ZRR2016 = new SiteCollection('ZRR-2018', [docLib], ['image1.jpg', 'image2.jpg', 'image3.jpg']);
    
        this.sitecollection = [ZRR2012, ZRR2013, ZRR2014, ZRR2015, ZRR2016];
    */
    constructor() {
      //  this.sitecollection = [new SiteCollection('bla', [new DocumentLibrary('DocLib')], ['bla.jpg'])];
        this.targetsites = new TargetSites();
       /* this.doclibs.subscribe(res => { this.targetsites.documentlibraries }, err => { });
        this.getLibs.subscribe(
        */
    }

    getLibs() {
        this.doclibs = this.targetsites.documentlibraries;
        
    }
    
}
