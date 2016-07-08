import {Component, Input } from "angular2/core";
import {SiteCollection} from './sitecollection';
import {TreeViewDocLib} from './treeView';
import {ItemExtract} from './ItemExtract';


@Component({
    selector: 'treeviewsite',
    templateUrl: './tree-view-site.html',
    directives: [TreeViewDocLib,ItemExtract]
})

export class TreeViewSite  {
    @Input() sitecollection: Array<SiteCollection>;

 
}