import {Directory} from './directory';
import {DataService} from './dataservice';
import {SiteCollection} from './sitecollection';

export class DocumentLibrary {
    name: string;
    selected: boolean;
    path: string;
    expanded: boolean;
    directories: Array<Directory>;
    relpath: string;
    dataService: DataService;
    parent: SiteCollection;

    constructor(name, path, parent) {
        this.name = name;
        this.selected = false;
        this.parent = parent;
        this.relpath = path;
       // this.cutPath(path);
        this.expanded = false;
        this.dataService = new DataService();
      //  this.directories = [new Directory("thisname",[new Directory("thisbla",[new Directory("thisbla")])])];
        
    }

   /* cutPath(path) {
        this.relpath = path.match("(?=" + this.parent.path + ").*?(?=/Form)").toString();
        this.relpath = this.relpath.substring(this.relpath.lastIndexOf('/') + 1);

       
    }*/


    getStyle() {
        if (this.expanded) {
            return "yellow";
        } else {
            return "white";
        }
    }

    toggle() {
        this.expanded = !this.expanded;
        var tempresponse;
        if (this.expanded) {
            this.dataService.searchDirectories(this.parent.path,this.relpath,this).then(
                response => {
                    
                    tempresponse = response;
                    this.directories = tempresponse;
                    console.log(tempresponse);
                }, response => {
                    console.log("Failure " + response);
                });
        }
    }
}