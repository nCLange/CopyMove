import {DataService} from './dataservice';
import {CopyRoot} from './copyroot';
import {FieldContent} from './fieldcontent';

export enum ContentType { File, Folder, DocSet }

export class ItemDL {

    id: number;
    parent: CopyRoot;
    dataService: DataService;
    targetId: number;
    name: string;
    title: string;
    srcUrl: string;
    // fileContent;
    data1: SP.Taxonomy.TaxonomyFieldValueCollection;
    type: ContentType;
    //exists: boolean;
    contentQueue: Array<number>;
    relativePath: string;
    targetFolderURL: string;
    srcFolderURL: string;
    contentTypeId: string;
    //parentFolder: SP.Folder;
    status: string;
    data2: SP.Taxonomy.TaxonomyFieldValueCollection;
    parentFolderId: number;
    contentTypeName: string;
    contents: Array<FieldContent>;


    constructor(id, parent: CopyRoot, targetFolderURL = "", srcFolderURL = "", parentFolderId = null) {
        this.id = id;
        this.parent = parent;
        this.dataService = new DataService();
        this.contentQueue = [];
        this.targetFolderURL = targetFolderURL;
        this.srcFolderURL = srcFolderURL;
        //this.parentFolder = parentFolder;
        this.contentTypeId = null;
        this.parentFolderId = parentFolderId;
        this.contents = [];

        // this.dataService.getFileAsBufferArray(parent.srcUrl + parent.title, id);

        if (this.incCall() == true) return;
        this.dataService.getContent(this).then(
            response => {
                this.decCall();
                this.status = "Got Status";
                switch (this.type) {
                    case ContentType.File:
                        if (this.incCall() == true) return;
                        this.dataService.readListItem(this).then(
                            response => {
                                this.decCall();
                                this.status = "Read File Information";
                                if (this.incCall() == true) return;
                                this.dataService.soapAjax(this).then(
                                    response => {
                                        this.decCall();
                                        this.status = "Done";
                                        this.parent.done(this, null);
                                        // this.fileContent = null; // Delete Buffer
                                        // if(this.incCall()==true) return;
                                        /*   this.dataService.fillListItem(this).then(
                                               response => {
                                                   this.decCall();
                                                 //  this.dataService.fillListItem(this); // Dunno warum Doppelt
                                                   this.status = "Done";
                                               },
                                               response => {
                                                   this.decCall();
                                                   console.error("Fill Listitems Failure" + response);
                                               });*/
                                    },
                                    response => {
                                        this.status = "Error";
                                        this.parent.done(this, "File couldn't copy" + response);
                                    });
                            }, response => {
                                this.decCall();
                                this.status = "Error";
                                this.parent.done(this, "readFileToCopy Failure " + response);
                            });
                        break;
                    case ContentType.Folder:
                        if (this.incCall() == true) return;
                        this.dataService.getFolder(this).then(
                            response => {
                                this.decCall();
                                this.status = "Got Folder Information";
                                if (this.incCall() == true) return;
                                this.dataService.copyFolder(this).then(
                                    response => {
                                        this.decCall();
                                        this.status = "Done";
                                        this.parent.done(this, null);
                                    },
                                    response => {
                                        this.decCall();
                                        this.status = "Error";
                                        this.parent.done(this, "copyFolder Failure " + response);
                                    })
                            },
                            response => {
                                this.decCall();
                                this.status = "Error";
                                this.parent.done(this, "getFolder Failure " + response);
                            });
                        break;
                    case ContentType.DocSet:
                        if (this.incCall() == true) return;
                        this.dataService.getFolder(this).then(
                            response => {
                                this.decCall();
                                this.status = "Got Document Set Information";
                                if (this.incCall() == true) return;
                                this.dataService.copyDocSet(this).then(
                                    response => {
                                        this.decCall();
                                        this.status = "Document Set copied";
                                        if (this.incCall() == true) return;
                                        this.dataService.readListItem(this).then(
                                            response => {
                                                this.decCall();
                                                this.status = "Read Document Set Information";
                                                if (this.incCall() == true) return;
                                                this.dataService.fillListItem(this).then(
                                                    response => {
                                                        this.decCall();
                                                        // this.dataService.fillListItem(this); // Dunno warum Doppelt
                                                        this.status = "Done";
                                                        this.parent.done(this, null);
                                                    },
                                                    response => {
                                                        this.decCall();
                                                        this.status = "Error";
                                                        this.parent.done(this, "FillListItemDocSet Failure " + response);
                                                    });
                                            },
                                            response => {
                                                this.decCall();
                                                this.status = "Error";
                                                this.parent.done(this, "readListItem Failure" + response);
                                            });
                                    },
                                    response => {
                                        this.decCall();
                                        this.status = "Error";
                                        this.parent.done(this, "copyDocSet Failure " + response);
                                    })
                            },
                            response => {
                                this.decCall();
                                this.status = "Error";
                                this.parent.done(this, "getFolderDocSet Failure " + response);
                            });
                        break;

                    default:
                        this.decCall();
                        this.status = "Error";
                        this.parent.done(this, "Unknown Format");
                        break;
                }
            },
            response => {
                this.decCall();
                this.status = "Error";
                this.parent.done(this, "getContent Failure" + response);
            });
    }

    addToQueue(input: number) {
        this.contentQueue.push(input);
    }

    releaseQueue() {

        for (var x = 0; x < this.contentQueue.length; x++) {
            // this.parent.addToArray(this.contentQueue[x], this.targetFolderURL, this.parentFolder);
            this.parent.addToArray(this.contentQueue[x], this.targetFolderURL, this.srcFolderURL, this.parentFolderId);
        }

        this.contentQueue = [];

    }

    timeOut() {
        let that = this;
        if (this.parent.currentCalls >= this.parent.maxCalls) {
            setTimeout(that.timeOut, 50);
            return false;

        }
    }

    incCall() {
        if (this.parent.canceled == true) {
            this.status = "Canceled";
            return true;
        }
        this.timeOut();
        this.parent.currentCalls++;
        return false;
    }

    decCall() {
        this.parent.currentCalls--;
    }

}