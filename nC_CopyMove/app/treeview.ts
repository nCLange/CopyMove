import {Component, Input} from '@angular/core';
import {DocumentLibrary} from './documentlibrary';
import {TreeViewDirectory} from './treeviewdirectory';


@Component({
    selector: 'tree-view-doclib',
    template: `<ul class="libList">
                <li class="libListElements" *ngFor="let library of documentlibrary"><div [style.background-color]="library.getStyle()" (dblclick)="mark(library)" (click)="select(library)"><img src="../../_layouts/15/images/sts_list_documentlibrary16.gif">&nbsp;{{library.name}}</div><div *ngIf="library.expanded"><tree-view-directory [folderLookUp]="library"></tree-view-directory></div></li>
               </ul>`,
    directives: [TreeViewDirectory]
})
export class TreeViewDocLib {
    @Input() documentlibrary: Array<DocumentLibrary>;
    dblclick: boolean;
    constructor() {

    }
    select(library: DocumentLibrary) {
        let that = this;
        this.dblclick = false;
        setTimeout(
            function () {
               // console.log(this.dblclick);
                if (that.dblclick == false)
                    library.toggle();
            }, 400);
    }

    mark(library: DocumentLibrary) {
        this.dblclick = true;
        library.select("--1");
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
