import {Component, Input} from 'angular2/core';
import {Directory} from './directory';

import {DocumentLibrary} from './documentlibrary';


@Component({
    selector: 'tree-view-directory',
    template: `<ul>
                <li [style.background-color]="directory.getStyle()"  *ngFor="let directory of folderLookUp.directories"><div (click)="select(directory)">{{directory.name}}</div><div *ngIf="directory.expanded"><tree-view-directory [folderLookUp]="directory"></tree-view-directory></div></li>
               </ul>`,
    directives: [TreeViewDirectory]
})
export class TreeViewDirectory {
    @Input() folderLookUp: DocumentLibrary;
    selected: boolean;
    constructor() {

    }
    select(directory: Directory) {
        this.selected = !this.selected;
        directory.toggle();
    }
    
    getStyle() {
        if (this.selected) {
            return "yellow";
        } else {
            return "white";
        }
    }

    

}
