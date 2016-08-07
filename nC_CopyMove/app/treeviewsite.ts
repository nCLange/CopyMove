import {Component, Input } from "angular2/core";
import {SiteCollection} from './sitecollection';
import {TreeViewDocLib} from './treeView';
import {DocumentLibrary} from './documentlibrary';
import {CopyRoot} from './copyroot';
import {ItemDL} from './itemdl';


@Component({
    selector: 'tree-view-site',
    templateUrl: './tree-view-site.html',
    directives: [TreeViewDocLib]
})
export class TreeViewSite {
    @Input() sitecollection: Array<SiteCollection>;

    screen: number;
    @Input() filesToCopy: Array<ItemDL>;

    copyroot: CopyRoot;

    constructor() {
        this.screen = 0;

    }

    canceled() {
        this.screen = 0;
        this.copyroot.canceled = true;

    }

    clicked(delafter) {
        this.screen = 1;
        this.copyroot  = new CopyRoot(delafter, this.sitecollection);
        this.filesToCopy = this.copyroot.items;
        
    }

}