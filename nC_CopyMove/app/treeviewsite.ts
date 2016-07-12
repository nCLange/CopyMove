import {Component, Input } from "angular2/core";
import {SiteCollection} from './sitecollection';
import {TreeViewDocLib} from './treeView';
import {ItemExtract} from './ItemExtract';
import {TargetSites} from './targetsites';


@Component({
    selector: 'treeviewsite',
    templateUrl: './tree-view-site.html',
    directives: [TreeViewDocLib,ItemExtract]
})

export class TreeViewSite  {
    @Input() sitecollection: Array<SiteCollection>;
    target: TargetSites;

    constructor() {
        this.target = new TargetSites();
    }

 
}