import {Component, Input, OnInit} from "@angular/core";
import {SiteCollection} from './sitecollection';
import {TreeViewDocLib} from './treeView';
import {DocumentLibrary} from './documentlibrary';
import {CopyRoot} from './copyroot';
import {ItemDL} from './itemdl';
import {SiteColPipe} from './filterpipe';
import {DataService} from './dataservice';


@Component({
    selector: 'tree-view-site',
    templateUrl: './tree-view-site.html',
    directives: [TreeViewDocLib],
    pipes: [SiteColPipe]
})
export class TreeViewSite {

    @Input() searchValue: string = null;

    @Input() sitecollection: Array<SiteCollection>;
    @Input() selected: boolean;
    @Input() errorSiteCol: string;

    screen: number;
    @Input() filesToCopy: Array<ItemDL>;
    @Input() errorReport: Array<String>;
    copyroot: CopyRoot;
    @Input() moved: boolean;
    dataService: DataService;
    initialSet = false;
    counter = 0;
    loading = false;

    displaySiteCol: Array<SiteCollection> = [];

    constructor() {
        this.screen = 0;
        this.filesToCopy = null;
        this.errorReport = null;
        this.moved = false;
        this.dataService = new DataService();




    }

    ngAfterViewChecked() {
        if (this.initialSet == false) {
            if (this.sitecollection && this.sitecollection.length>0) {
                this.displaySiteCol = this.sitecollection;
                this.initialSet = true;
            }
        }
    }

    canceled() {
        this.screen = 0;
        this.copyroot.canceled = true;

    }

    clicked(delafter) {
        this.moved = delafter;
        this.screen = 1;
        this.copyroot = new CopyRoot(delafter, this);
        this.filesToCopy = this.copyroot.items;
        this.errorReport = this.copyroot.errorReport;

    }

    done() {
        window.parent.location.reload(true);
    }

    filterResult(inputText) {
        if (!inputText || inputText.length < 3) {
            this.counter++;
            this.displaySiteCol = this.sitecollection;
            this.loading=false;
            return;
        }
        this.displaySiteCol=[];
        this.counter++;
        this.loading=true;
        this.dataService.searchDocLibFilter(this, inputText,this.counter).then(
            response => {
                if(response[0]!=this.counter) return;
                this.loading=false;
                this.displaySiteCol = response[1] as Array<SiteCollection>;
            },
            response => {
                console.log("Error SearchDocLibFilter");
                if(response[0]!=this.counter) return;
                this.loading=false;
            }
        )
        console.log(inputText);

    }

     unsetAll() {
        this.selected = true;
        for (var i = 0; i < this.displaySiteCol.length; i++) {
            for (var j = 0; j < this.displaySiteCol[i].documentLibraries.length; j++) {
                this.displaySiteCol[i].documentLibraries[j].selected = false;
                for (var k = 0; k < this.displaySiteCol[i].documentLibraries[j].directories.length; k++) {
                    this.displaySiteCol[i].documentLibraries[j].directories[k].unsetAll();
                }
            }
        }
    }


}