import {Component, Input} from 'angular2/core';
import {Directory} from './directory';

import {DocumentLibrary} from './documentlibrary';


@Component({
    selector: 'tree-view-directory',
    template: `<ul>
                <li *ngFor="let directory of folderLookUp.directories"><div [style.background-color]="directory.getStyle()"(dblclick)="mark(directory)" (click)="select(directory)">{{directory.name}}</div><div *ngIf="directory.expanded"><tree-view-directory [folderLookUp]="directory"></tree-view-directory></div></li>
               </ul>`,
    directives: [TreeViewDirectory]
})
export class TreeViewDirectory {
    @Input() folderLookUp: DocumentLibrary;
    selected: boolean;
    dblclick: boolean;
    constructor() {

    }
    select(directory: Directory) {
        let that = this;
        this.dblclick = false;
        setTimeout(
            function () {
                if(that.dblclick==false)
                    directory.toggle();
            }, 400);

       
    }

    mark(directory: Directory) {
        
        this.dblclick = true;
        directory.select();
    }

}
