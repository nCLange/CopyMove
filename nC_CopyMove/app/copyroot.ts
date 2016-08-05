import {DataService} from './dataservice';
import {ItemDL} from './itemdl';
import {SiteCollection} from './sitecollection';
import {DocumentLibrary} from './documentlibrary';
import {Directory} from './directory';



export class CopyRoot{
    srcUrl :string;
    targetUrl: string;
    private selectedItemIds = [23,32, 3];
    title = "DocaDoca";
   
    targetTitle: string;
    rootpath: string;
    rootFolder: SP.Folder;
    maxCalls: number;
    currentCalls: number;
    private deleteAfterwards: boolean;
    dataService: DataService;
    folderString: string;

    items : Array<ItemDL>;
    static targetUrlArray: Array<String>;
    


    constructor(delafter: boolean, sitecollections: Array<SiteCollection>) {

        this.targetUrl = SiteCollection.targetPath;
        this.targetTitle = DocumentLibrary.targetTitle;
        this.rootpath = "";
        this.rootFolder = null;
        this.dataService = new DataService();
        this.maxCalls = 1;
        this.currentCalls = 0;
        this.srcUrl = _spPageContextInfo.webAbsoluteUrl;
        console.log(_spPageContextInfo.webAbsoluteUrl);
        

        if (Directory.selectedPath != undefined && Directory.selectedPath != "" && Directory.selectedPath != null) {
            this.rootpath = Directory.selectedPath;
            this.dataService.getFolderFromUrl(this).then(
                response => {
                    this.items = [];
                    this.deleteAfterwards = delafter;
                    for (var id = 0; id < this.selectedItemIds.length; id++) {
                        this.items.push(new ItemDL(this.selectedItemIds[id], this, this.rootpath, this.rootFolder));
                    }
                },
                response => { console.log("getFolderFromUrl Error " + response); });

        }
        else {
            this.items = [];
            this.deleteAfterwards = delafter;
            for (var id = 0; id < this.selectedItemIds.length; id++) {
                this.items.push(new ItemDL(this.selectedItemIds[id], this));
            }
        }


      //  this.targetUrlArray = null;
       // this.folderString = "";
        /*
        for (var i = 0; i < sitecollections.length; i++) {
            var url;
            if (sitecollections[i].expanded) {
                this.targetUrl = sitecollections[i].path;
              
               for (var j = 0; j < sitecollections[i].documentLibraries.length; j++) {
                   if (sitecollections[i].documentLibraries[j].expanded) {
                       this.targetTitle = sitecollections[i].documentLibraries[j].name;
                       var folder:any = sitecollections[i].documentLibraries[j];
                       while (folder.expanded) {
                           for (var k = 0; k < folder.directories.length; k++) {
                             
                               if (folder.directories[k].expanded) {
                                   folder = folder.directories[k];
                                  // -> if folder expanded and children folder isnt -> get absolute URL
                                  // -> if DL expanded and children folder isnt -> get url DL
                               }                           
                           }
                           break;
                       }
                   }

                }
            }
        }*/

       // console.log("FolderString " +this.folderString);
     





    }

    addToArray(id,folderURL,parentFolderId) {
        this.items.push(new ItemDL(id, this, folderURL,parentFolderId));
       
      //  console.log("ID:" + id + " folderURL: " + folderURL);
        //console.log(folderURL);
    }


}