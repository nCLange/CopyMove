import {Component, Input} from 'angular2/core';
import {DocumentLibrary} from './documentlibrary';
import {TreeViewDirectory} from './treeviewdirectory';


@Component({
    selector: 'tree-view-doclib',
    template: `<ul >
                <li *ngFor="let library of documentlibrary"><div [style.background-color]="library.getStyle()" (click)="select(library)">{{library.name}}</div><div *ngIf="library.expanded"><tree-view-directory [folderLookUp]="library"></tree-view-directory></div></li>
               </ul>`,
    directives: [TreeViewDirectory]
})
export class TreeViewDocLib {
    @Input() documentlibrary: Array<DocumentLibrary>;
    constructor() {

    }
    select(library: DocumentLibrary) {
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
