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
    exists: boolean;
    contentQueue: Array<number>;
    relativePath: string;
    folderURL: string;
    contentTypeId: SP.ContentTypeId;
    parentFolder: SP.Folder;
    

    constructor(id,parent,folderURL="",parentFolder=null) {
        this.id = id;
        this.parent = parent;
        this.dataService = new DataService();
        this.contentQueue = [];
        this.folderURL = folderURL;
        this.parentFolder = parentFolder;
     
        



        // this.dataService.getFileAsBufferArray(parent.srcUrl + parent.title, id);

        this.dataService.getContent(this).then(
            response => {
                switch (this.type) {

                    case ContentType.File:
                        this.dataService.readFileToCopy(this).then(
                            response => {

                               this.dataService.downloadFile(this).then(
                                    response => {

                                        this.dataService.createFile2(this).then(
                                            response => {
                                                this.fileContent = null; // Delete Buffer
                                                this.dataService.fillListItem(this).then(
                                                    response => { this.dataService.fillListItem(this) },
                                                    response => {
                                                        console.error("Fill Listitems Failure" + response);
                                                    });

                                            }, response => {

                                                console.error("CreateFile Failure" + response);
                                            });

                                    }, response => {
                                        console.error("DownloadFile Failure " + response);
                                    });

                               // this.dataService.soapAjax(this);

                            }, response => {
                                console.log("readFileToCopy Failure " + response);
                            });
                        break;
                    case ContentType.Folder:
                        this.dataService.getFolder(this).then(
                            response => {
                                this.dataService.copyFolder(this).then(
                                    response => { },
                                    response => { console.log("copyFolder Failure " + response); })
                            },
                            response => { console.log("getFolder Failure " + response); });
                        break;
                    case ContentType.DocSet:
                       
                        this.dataService.getFolder(this).then(
                            response => {
                                this.dataService.copyDocSet(this).then(
                                    response => { },
                                    response => { console.log("copyDocSet Failure " + response); })
                            },
                            response => { console.log("getFolderDocSet Failure " + response); });
                        break;

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

    addToQueue(input: number) {
        this.contentQueue.push(input);
    }

    releaseQueue() {

        for (var x = 0; x < this.contentQueue.length;x++) {
           // console.log("Queue Released: " + this.contentQueue[x]);
            this.parent.addToArray(this.contentQueue[x], this.folderURL, this.parentFolder);
        }

        this.contentQueue = [];

    }

}