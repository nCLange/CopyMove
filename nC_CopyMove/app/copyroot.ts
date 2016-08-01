import {DataService} from './dataservice';
import {ItemDL} from './itemdl';



export class CopyRoot{
    srcUrl = "http://win-iprrvsfootq/sites/dev";
    targetUrl ="http://win-iprrvsfootq/sites/dev";
    private selectedItemIds = [1, 2,3,23];
    title = "DocaDoca";
    targetTitle = "DocumentTest1";
    private deleteAfterwards;
    dataService: DataService;

    items : Array<ItemDL>;



    constructor(delafter, sitecollections) {
        this.items = [];
        this.deleteAfterwards = delafter;
        for (var id = 0; id < this.selectedItemIds.length; id++) {
         //   console.log("Whats inside root "+this.selectedItemIds[id]);
            this.items.push(new ItemDL(this.selectedItemIds[id], this));
        }

    }

    addToArray(id,folderURL,parentFolder) {
        this.items.push(new ItemDL(id, this, folderURL,parentFolder));
       
      //  console.log("ID:" + id + " folderURL: " + folderURL);
        //console.log(folderURL);
    }


}