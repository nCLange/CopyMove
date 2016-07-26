import {DataService} from './dataservice';
import {ItemDL} from './itemdl';



export class CopyRoot{
    srcUrl = "http://win-iprrvsfootq/sites/dev";
    targetUrl ="http://win-iprrvsfootq/sites/devsite";
    private selectedItemIds = [2];
    title = "DocaDoca";
    targetTitle = "DocumentTest1";
    private deleteAfterwards;
    dataService: DataService;
    private 

    itemIds : Array<ItemDL>;



    constructor(delafter) {
        this.itemIds = [];
        this.deleteAfterwards = delafter;
        for (var id in this.selectedItemIds) {

            this.itemIds.push(new ItemDL(id, this));
        }

    }


}