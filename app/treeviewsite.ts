import {Component, Input } from "@angular/core";
import {SiteCollection} from './sitecollection';
import {TreeViewDocLib} from './treeView';
import {DocumentLibrary} from './documentlibrary';
import {CopyRoot} from './copyroot';
import {ItemDL} from './itemdl';
import {SiteColPipe} from './filterpipe';


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

    screen: number;
    @Input() filesToCopy: Array<ItemDL>;
    @Input() errorReport: Array<String>;
    copyroot: CopyRoot;
    @Input() moved: boolean;

    constructor() {
        this.screen = 0;
        this.filesToCopy = null;
        this.errorReport = null;
        this.moved = false;

    }

    canceled() {
        this.screen = 0;
        this.copyroot.canceled = true;

    }

    clicked(delafter) {
        this.moved = delafter;
        this.screen = 1;
        this.copyroot  = new CopyRoot(delafter, /*this.sitecollection,*/this);
        this.filesToCopy = this.copyroot.items;
        this.errorReport = this.copyroot.errorReport;
        
    }

    done(){
        window.parent.location.reload();
    }


}