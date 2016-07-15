import {Component,EventEmitter, Input} from 'angular2/core';
import {Control, FORM_DIRECTIVES} from 'angular2/common';
import 'rxjs/Rx';
import {TreeViewSite} from './treeviewsite';
import {SiteCollection} from './sitecollection';
import {DocumentLibrary} from './documentlibrary';
import {DataService} from './dataservice';
import {TargetSites} from './targetSites';


@Component({
    selector: "app-main",
    providers: [DataService],
   // template:'<H1>Hello</H1>',
   // template: '<treeviewsite [sitecollection]="sitecollection"></treeviewsite>',
   template: '<treeviewsite></treeviewsite>',
    directives: [TreeViewSite]
})

export class AppComponent {
    sitecollection: Array<SiteCollection>;
    doclibs: Array<DocumentLibrary>;
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
        this.sitecollection = [new SiteCollection('bla', "2")];
      //  this.targetsites = new TargetSites();

       // this.targetsites.subscribe((event) => this.getLibs());
   
       /* this.doclibs.subscribe(res => { this.targetsites.documentlibraries }, err => { });
        this.getLibs.subscribe(
        */


       
    }
/*
    getLibs() {
        this.sitecollection = this.targetsites.siteCollection;
        console.log("ABC");
        
    }*/

    
}
