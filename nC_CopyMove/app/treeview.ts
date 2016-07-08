import {Component, Input} from 'angular2/core';
import {DocumentLibrary} from './documentlibrary';


@Component({
    selector: 'tree-view-doclib',
    template: `<ul >
                <li [style.background-color]="getStyle()" (click)="select(library)" *ngFor="#library of documentlibrary">{{library.name}}</li>
               </ul>`
})
export class TreeViewDocLib {
    @Input() documentlibrary: Array<DocumentLibrary>;
    selected: boolean;
    constructor() {


    }
    select(library: DocumentLibrary) {
        this.selected = !this.selected;
    }
    getStyle() {
        if (this.selected) {
            return "yellow";
        } else {
            return "white";
        }
    }

}
