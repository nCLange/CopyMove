import {Component} from '@angular/core';
import {TreeViewSite} from './treeviewsite';
import {SiteCollection} from './sitecollection';
import {DocumentLibrary} from './documentlibrary';
import {DataService} from './dataservice';


@Component({
    selector: "app-main",
    providers: [DataService],
    // template:'<H1>Hello</H1>'
    template: '<tree-view-site [sitecollection]="sitecollection" [selected]="selected" [errorSiteCol]="errorSiteCol"></tree-view-site>',
    directives: [TreeViewSite]
})

export class AppComponent {
    sitecollection: Array<SiteCollection>;
    errorSiteCol: string;
    selected: boolean;
    constructor(private dataService: DataService) {
        this.errorSiteCol = "";
        this.sitecollection = [];
        dataService.searchSiteCollection(this).then(
            response => {
                var tempresponse;
                tempresponse = response;
                this.sitecollection = tempresponse;
                if(this.sitecollection.length==0) 
                    this.errorSiteCol = "Couldn't find any Site Collections";
            }, response => {
                console.log("Failure " + response);
                 this.errorSiteCol="Failure with the search API: "+response;
            });
    }

    unsetAll() {
        this.selected=true;
        for (var i = 0; i < this.sitecollection.length; i++) {
            for (var j = 0; j < this.sitecollection[i].documentLibraries.length; j++) {
                this.sitecollection[i].documentLibraries[j].selected = false;
                for (var k = 0; k < this.sitecollection[i].documentLibraries[j].directories.length; k++) {
                    this.sitecollection[i].documentLibraries[j].directories[k].selected = false;
                    //loop for all directories
                }
            }
        }
    }
}