import {Directory} from './directory';
import {DataService} from './dataservice';
import {SiteCollection} from './sitecollection';

export class DocumentLibrary {
    name: string;
    title: string;
    selected: boolean;
    path: string;
    expanded: boolean;
    directories: Array<Directory>;
    relpath: string;
    dataService: DataService;
    parent: SiteCollection;
    static targetTitle: string;
    static targetName : string;
    static srcListUrl: string;
    listUrl:string;
    visible:boolean;

    constructor(name, title,path, parent) {
        this.name = name;
        this.title = title;
        this.selected = false;
        this.parent = parent;
     //   this.relpath = path;
        this.relpath = name;
       // this.cutPath(path);
        this.expanded = false;
        this.dataService = new DataService();
        this.directories = [];
        this.visible=true;
        this.listUrl="";
      //  this.directories = [new Directory("thisname",[new Directory("thisbla",[new Directory("thisbla")])])];
        
    }

   /* cutPath(path) {
        this.relpath = path.match("(?=" + this.parent.path + ").*?(?=/Form)").toString();
        this.relpath = this.relpath.substring(this.relpath.lastIndexOf('/') + 1);

       
    }*/


    getStyle() {
        if (this.selected) {
            return "rgba(156, 206, 240, 0.5)";
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
                }, response => {
                    console.log("Failure " + response);
                });
        }
    }

    select(input=null) {
        if (input == "--1") {
            Directory.selectedPath = "";
        }
        this.parent.unsetAll();
        this.selected = true;
        DocumentLibrary.targetTitle = this.title;
        DocumentLibrary.targetName = this.name;
        DocumentLibrary.srcListUrl = this.listUrl;

    }

    unsetAll() {
        this.parent.unsetAll();
    }
}