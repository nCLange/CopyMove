import {DocumentLibrary} from './documentlibrary';
import {TargetSites} from './targetsites';

export class SiteCollection {
    name: string;
    documentLibraries: Array<DocumentLibrary>;
    files: Array<string>;
    expanded: boolean;
    checked: boolean;
    targetSites: TargetSites;
    path: string;

    constructor(name, path="", files=[""]) {
        this.name = name;
        this.files = files;
        this.documentLibraries = [];
        this.expanded = false;
        this.checked = false;
        this.path = path;
   
    }
   toggle() {
           this.expanded = !this.expanded;
           if (this.expanded) {

        }
    }
    check() {
        let newState = !this.checked;
        this.checked = newState;
        //      this.checkRecursive(newState);
    }

}
    // checkRecursive(state){
    //     this.documentLibraries.forEach(d => {
    //         d.checked = state;
    //         d.checkRecursive(state);
    //     })
    // }