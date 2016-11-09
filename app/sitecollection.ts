import {DocumentLibrary} from './documentlibrary';
import {DataService} from './dataservice';
import {AppComponent} from './app.component';

export class SiteCollection {
    name: string;
    documentLibraries: Array<DocumentLibrary>;
    files: Array<string>;
    expanded: boolean;
    checked: boolean;
    path: string;
    private dataService: DataService
    parent: AppComponent;
    static targetPath: string;
    visible: boolean;
    gotSearched: boolean = false;



    constructor(name, path, parent) {
        this.name = name;
        this.expanded = false;
        this.checked = false;
        this.path = path;
        this.dataService = new DataService();
        this.parent = parent;
        this.documentLibraries = [];
        this.visible = true;
        /*
                this.dataService.searchDocumentLibrary2(this.path,this).then(
                        response => {
                            var tempresponse;
                            tempresponse = response;
                            this.documentLibraries = tempresponse;
                        }, response => {
                            console.log("Failure " + response);
                        });
        */
    }


    toggle() {
        this.expanded = !this.expanded;
        if (this.expanded && this.gotSearched == false) {
            this.dataService.searchDocumentLibrary3(this.path, this).then(
                response => {
                    var tempresponse;
                    tempresponse = response;
                    this.documentLibraries = tempresponse;
                    this.gotSearched = true;
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

    unsetAll() {
        SiteCollection.targetPath = this.path;
        this.parent.unsetAll();


    }

    createDocLib(path,title,junk){
        this.documentLibraries.push(new DocumentLibrary(path,title,junk,this));
        this.expanded=true;
        this.visible=true;
        this.gotSearched=true;
    }

}
    // checkRecursive(state){
    //     this.documentLibraries.forEach(d => {
    //         d.checked = state;
    //         d.checkRecursive(state);
    //     })
    // }