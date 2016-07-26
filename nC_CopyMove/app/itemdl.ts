import {DataService} from './dataservice';


export class ItemDL {

    id: number;
    parent;
    dataService: DataService;


    constructor(id,parent) {
        this.id = id;
        this.parent = parent;
        this.dataService = new DataService();


        // this.dataService.getFileAsBufferArray(parent.srcUrl + parent.title, id);
        this.dataService.copyFile(this);
  /*      this.dataService.getElementById(parent.srcUrl, parent.title, 1,parent).then(
            response => {
                var tempresponse;
                tempresponse = response;
               // this.itemList = tempresponse;
            }, response => {
                console.log("Failure " + response);
            });
        */

    }

}