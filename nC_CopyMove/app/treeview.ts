import {Component, Input} from 'angular2/core';
import {DocumentLibrary} from './documentlibrary';
import {TreeViewDirectory} from './treeviewdirectory';


@Component({
    selector: 'tree-view-doclib',
    template: `<ul >
                <li [style.background-color]="library.getStyle()" *ngFor="let library of documentlibrary"><div (click)="select(library)">{{library.name}}-{{library.path}}</div><div *ngIf="library.expanded"><tree-view-directory [folderLookUp]="library"></tree-view-directory></div></li>
               </ul>`,
    directives: [TreeViewDirectory]
})
export class TreeViewDocLib {
    @Input() documentlibrary: Array<DocumentLibrary>;
    //selected: boolean;
    constructor() {

    }
    select(library: DocumentLibrary) {
        //this.selected = !this.selected;
        library.toggle();
    }
    /*
    getStyle() {
        if (this.selected) {
            return "yellow";
        } else {
            return "white";
        }
    }
    */
    

}
