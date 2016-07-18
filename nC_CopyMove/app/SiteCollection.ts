import {DocumentLibrary} from './documentlibrary';
import {DataService} from './dataservice';

export class SiteCollection {
    name: string;
    documentLibraries: Array<DocumentLibrary>;
    files: Array<string>;
    expanded: boolean;
    checked: boolean;
    path: string;
    private dataService: DataService

    constructor(name, path) {
        this.name = name;
        this.expanded = false;
        this.checked = false;
        this.path = path;
        this.dataService = new DataService();
    }

 
    toggle() {
        this.expanded = !this.expanded;
        if (this.expanded) {
            this.dataService.searchDocumentLibrary(this.path,this).then(
                response => {
                    var tempresponse;
                    tempresponse = response;
                    this.documentLibraries = tempresponse;
                    console.log(tempresponse);
                }, response => {
                    console.log("Failure " + response);
                });
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