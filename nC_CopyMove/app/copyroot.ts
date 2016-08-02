import {DataService} from './dataservice';
import {ItemDL} from './itemdl';
import {SiteCollection} from './sitecollection';
import {DocumentLibrary} from './documentlibrary';



export class CopyRoot{
    srcUrl = "http://win-iprrvsfootq/sites/dev";
   // targetUrl ="http://win-iprrvsfootq/sites/dev";
    targetUrl: string;
    private selectedItemIds = [1,2, 23];
    title = "DocaDoca";
    targetTitle: string;
   // targetTitle = "DocumentTest1";
    private deleteAfterwards;
    dataService: DataService;
    folderString: string;

    items : Array<ItemDL>;
    static targetUrlArray: Array<String>;


    constructor(delafter, sitecollections: Array<SiteCollection>) {
      //  this.targetUrlArray = null;
        this.folderString = "";

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
        }

        console.log("FolderString " +this.folderString);
     



        this.items = [];
        this.deleteAfterwards = delafter;
        for (var id = 0; id < this.selectedItemIds.length; id++) {
            this.items.push(new ItemDL(this.selectedItemIds[id], this));
        }

    }

    addToArray(id,folderURL,parentFolder) {
        this.items.push(new ItemDL(id, this, folderURL,parentFolder));
       
      //  console.log("ID:" + id + " folderURL: " + folderURL);
        //console.log(folderURL);
    }


}