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
    //exists: boolean;
    contentQueue: Array<number>;
    relativePath: string;
    folderURL: string;
    contentTypeId: string;
    //parentFolder: SP.Folder;
    status: string;
    data2: SP.Taxonomy.TaxonomyFieldValueCollection;
    parentFolderId: number;
    contentTypeName:string;


    constructor(id, parent: CopyRoot, folderURL = "", parentFolderId = null) {
        this.id = id;
        this.parent = parent;
        this.dataService = new DataService();
        this.contentQueue = [];
        this.folderURL = folderURL;
        //this.parentFolder = parentFolder;
        this.contentTypeId = null;
        this.parentFolderId = parentFolderId;

        // this.dataService.getFileAsBufferArray(parent.srcUrl + parent.title, id);

        this.incCall();
        this.dataService.getContent(this).then(
            response => {
                this.decCall();
                this.status = "Got Status";
                switch (this.type) {
                    case ContentType.File:
                        this.incCall();
                        this.dataService.readListItem(this).then(
                            response => {
                                this.decCall();
                                this.status = "Read File Information";
                                this.incCall();
                               /* this.dataService.downloadFile(this).then(
                                    response => {
                                        this.decCall();
                                        this.status = "File Downloaded";
                                        this.incCall();
                                        this.dataService.createFile2(this).then(
                                            response => {
                                                this.decCall();
                                                this.status = "File created";
                                                this.fileContent = null; // Delete Buffer
                                                this.incCall();
                                                this.dataService.fillListItem(this).then(
                                                    response => {
                                                        this.decCall();
                                                        this.dataService.fillListItem(this); // Dunno warum Doppelt
                                                        this.status = "Done";
                                                    },
                                                    response => {
                                                        this.decCall();
                                                        console.error("Fill Listitems Failure" + response);
                                                    });
                                            }, response => {
                                                this.decCall();
                                                console.error("CreateFile Failure" + response);
                                            });
                                    }, response => {
                                        this.decCall();
                                        console.error("DownloadFile Failure " + response);
                                    });*/
                                    this.dataService.soapAjax(this).then(
                                     response =>{  
                                        this.decCall();
                                        this.status = "File Copied";
                                        this.fileContent = null; // Delete Buffer
                                        this.incCall();
                                        this.dataService.fillListItem(this).then(
                                            response => {
                                                this.decCall();
                                              //  this.dataService.fillListItem(this); // Dunno warum Doppelt
                                                this.status = "Done";
                                            },
                                            response => {
                                                this.decCall();
                                                console.error("Fill Listitems Failure" + response);
                                            });
                                        },
                                     response => {
                                         console.error("File couldn't copy"+ response);
                                     });
                            }, response => {
                                this.decCall();
                                console.log("readFileToCopy Failure " + response);
                            });
                        break;
                    case ContentType.Folder:
                        this.incCall();
                        this.dataService.getFolder(this).then(
                            response => {
                                this.decCall();
                                this.status = "Got Folder Information";
                                this.incCall();
                                this.dataService.copyFolder(this).then(
                                    response => {
                                        this.decCall();
                                        this.status = "Done";
                                    },
                                    response => {
                                        this.decCall();
                                        console.log("copyFolder Failure " + response);
                                    })
                            },
                            response => {
                                this.decCall();
                                console.log("getFolder Failure " + response);
                            });
                        break;
                    case ContentType.DocSet:
                        this.incCall();
                        this.dataService.getFolder(this).then(
                            response => {
                                this.decCall();
                                this.status = "Got Document Set Information";
                                this.incCall();
                                this.dataService.copyDocSet(this).then(
                                    response => {
                                        this.decCall();
                                        this.status = "Document Set copied";
                                        this.incCall();
                                        this.dataService.readListItem(this).then(
                                            response => {
                                                this.decCall();
                                                this.status = "Read Document Set Information";
                                                this.incCall();
                                                this.dataService.fillListItem(this).then(
                                                    response => {
                                                        this.decCall();
                                                       // this.dataService.fillListItem(this); // Dunno warum Doppelt
                                                        this.status = "Done";
                                                    },
                                                    response => {
                                                        this.decCall();
                                                        console.log("FillListItemDocSet Failure " + response);
                                                    });
                                            },
                                            response => {
                                                this.decCall();
                                                console.log("readListItem Failure" + response);
                                            });
                                    },
                                    response => {
                                        this.decCall();
                                        console.log("copyDocSet Failure " + response);
                                    })
                            },
                            response => {
                                this.decCall();
                                console.log("getFolderDocSet Failure " + response);
                            });
                        break;

                    default:
                        console.log("Unknown Format");
                        break;
                }
            },
            response => {
                this.decCall();
                console.log("getContent Failure" + response);
            });
    }

    addToQueue(input: number) {
        this.contentQueue.push(input);
    }

    releaseQueue() {

        for (var x = 0; x < this.contentQueue.length; x++) {
           // this.parent.addToArray(this.contentQueue[x], this.folderURL, this.parentFolder);
            this.parent.addToArray(this.contentQueue[x], this.folderURL, this.parentFolderId);
        }

        this.contentQueue = [];

    }

    timeOut() {
        let that = this;
        if (this.parent.currentCalls >= this.parent.maxCalls) {
            setTimeout(that.timeOut, 50);
            return;

        }
    }

    incCall() {
        this.timeOut();
        this.parent.currentCalls++;
    }

    decCall() {
        this.parent.currentCalls--;
    }

}