import {Component, Input } from "angular2/core";
import {SiteCollection} from './sitecollection';
import {TreeViewDocLib} from './treeView';
import {DocumentLibrary} from './documentlibrary';


@Component({
    selector: 'tree-view-site',
    templateUrl: './tree-view-site.html',
    directives: [TreeViewDocLib]
})
export class TreeViewSite {
    @Input() sitecollection: Array<SiteCollection>;


    clicked() {

    }

}