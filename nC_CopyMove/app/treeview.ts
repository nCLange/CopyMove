import {Component, Input} from 'angular2/core';
import {DocumentLibrary} from './documentlibrary';
import {TargetSites} from './targetsites';


@Component({
    selector: 'tree-view-doclib',
    template: `<ul >
                <li [style.background-color]="getStyle()" (click)="select(library)" *ngFor="#library of documentlibrary">{{library.name}}</li>
               </ul>`
})
export class TreeViewDocLib {
    @Input() documentlibrary: Array<DocumentLibrary>;
    selected: boolean;
    targetSites: TargetSites;
    constructor() {
       this.targetSites = new TargetSites();

    }
    select(library: DocumentLibrary) {
        this.selected = !this.selected;
        if (this.selected) {
            this.targetSites.searchDocumentLibrary;
            //gotta subscribe
            this.documentlibrary = this.targetSites.documentlibraries;
        }
        else this.documentlibrary = [];
    }
    getStyle() {
        if (this.selected) {
            return "yellow";
        } else {
            return "white";
        }
    }

}
