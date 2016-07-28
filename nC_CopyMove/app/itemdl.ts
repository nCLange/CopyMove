import {DataService} from './dataservice';
import {CopyRoot} from './copyroot';

export enum ContentType { File, Folder, DocSet }

export class ItemDL {

    id: number;
    parent: CopyRoot;
    dataService: DataService;
    targetId: number;
    name: string;
    title: string;
    srcUrl: string;
    fileContent;
    data1: SP.Taxonomy.TaxonomyFieldValueCollection;
    type: ContentType;
    

    constructor(id,parent) {
        this.id = id;
        this.parent = parent;
        this.dataService = new DataService();
        



        // this.dataService.getFileAsBufferArray(parent.srcUrl + parent.title, id);

        this.dataService.getContent(this).then(
            response => {
                switch (this.type) {

                    case ContentType.File:
                        this.dataService.readFileToCopy(this).then(
                            response => {

                                this.dataService.downloadFile(this).then(
                                    response => {

                                        this.dataService.createFile(this).then(
                                            response => {

                                                this.dataService.fillListItem(this).then(
                                                    response => { /*this.dataService.fillListItem(this)*/ },
                                                    response => {
                                                        console.error("Fill Listitems Failure" + response);
                                                    });

                                            }, response => {

                                                console.error("CreateFile Failure" + response);
                                            });

                                    }, response => {
                                        console.error("DownloadFile Failure " + response);
                                    });

                            }, response => {
                                console.log("readFileToCopy Failure " + response);
                            });

                    case ContentType.Folder:
                    default:
                        break;
              }
            },
            response => { "getContent Failure" + response });
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