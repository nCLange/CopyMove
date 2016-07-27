import {DataService} from './dataservice';
import {ItemDL} from './itemdl';



export class CopyRoot{
    srcUrl = "http://win-iprrvsfootq/sites/dev";
    targetUrl ="http://win-iprrvsfootq/sites/dev";
    private selectedItemIds = [1, 2];
    title = "DocaDoca";
    targetTitle = "DocumentTest1";
    private deleteAfterwards;
    dataService: DataService;
    private 

    items : Array<ItemDL>;



    constructor(delafter) {
        this.items = [];
        this.deleteAfterwards = delafter;
        for (var id = 0; id < this.selectedItemIds.length; id++) {
           // console.log(id);
            this.items.push(new ItemDL(this.selectedItemIds[id], this));
        }

    }


}