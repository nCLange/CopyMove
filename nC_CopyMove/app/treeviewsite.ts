import {Component, Input } from "angular2/core";
import {SiteCollection} from './sitecollection';
import {TreeViewDocLib} from './treeView';
import {ItemExtract} from './ItemExtract';
import {TargetSites} from './targetsites';
import {DocumentLibrary} from './documentlibrary';


@Component({
    selector: 'treeviewsite',
    templateUrl: './tree-view-site.html',
    directives: [TreeViewDocLib,TargetSites]
})

export class TreeViewSite  {
   // @Input() sitecollection: Array<SiteCollection>;
   // @Input() doclibs: Array<DocumentLibrary>


 
}