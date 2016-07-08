import {DocumentLibrary} from './documentlibrary';

export class SiteCollection {
    name: string;
    documentLibraries: Array<DocumentLibrary>;
    files: Array<string>;
    expanded: boolean;
    checked: boolean;

    constructor(name, directories, files) {
        this.name = name;
        this.files = files;
        this.documentLibraries = directories;
        this.expanded = false;
        this.checked = false;
    }
    toggle() {
        this.expanded = !this.expanded;
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