import {Component, Input } from "angular2/core";
import {SiteCollection} from './sitecollection';
import {TreeViewDocLib} from './treeView';
import {DocumentLibrary} from './documentlibrary';
import {CopyRoot} from './copyroot';


@Component({
    selector: 'tree-view-site',
    templateUrl: './tree-view-site.html',
    directives: [TreeViewDocLib]
})
export class TreeViewSite {
    @Input() sitecollection: Array<SiteCollection>;

    screen: number;

    constructor() {
        this.screen = 0;

    }


    clicked(delafter) {
        var copyroot = new CopyRoot(delafter);
        this.screen = 1;
    }

}