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
    type: ContentType;
    contentQueue: Array<number>;
    relativePath: string;
    targetFolderURL: string;
    srcFolderURL: string;
    contentTypeId: string;
    status: string;
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
        this.name="";
        this.status="";
        this.title="";

        // this.dataService.getFileAsBufferArray(parent.srcUrl + parent.title, id);

        if (this.incCall() == true) return;
        this.dataService.getContent(this).then(
            response => {
                this.decCall();
                switch (this.type) {
                    case ContentType.File:
                        if (this.incCall() == true) return;
                        this.dataService.readListItem(this).then(
                            response => {
                                this.decCall();
                                if (this.incCall() == true) return;
                                this.dataService.customSoapAjax(this).then(
                                    response => {
                                        this.decCall();
                                        this.status = "Done";
                                   //     if (this.incCall() == true) return;
                                        this.parent.done(this, null);
                                      /*  this.dataService.deleteCopySource(this)/*.then(
                                            response => {
                                                this.status = "Done";
                                                this.decCall();
                                                this.parent.done(this, null);
                                            },
                                            response => {
                                                this.status = "Error";
                                                this.decCall();
                                                this.parent.done(this, "Couldn't Delete CopySource: " + response);
                                            }
                                        )
                                    */

                                    },
                                    response => {
                                        this.decCall();
                                        this.status = "Error";
                                        this.parent.done(this, "File couldn't be copied: " + response);
                                    });
                            }, response => {
                                this.decCall();
                                this.status = "Error";
                                this.parent.done(this, "File couldn't be read: " + response);
                            });
                        break;
                    case ContentType.Folder:
                        if (this.incCall() == true) return;
                        this.dataService.getFolder(this).then(
                            response => {
                                this.decCall();
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
                                        this.parent.done(this, "Folder couldn't be copied: " + response);
                                    })
                            },
                            response => {
                                this.decCall();
                                this.status = "Error";
                                this.parent.done(this, "Folder couldn't be read: " + response);
                            });
                        break;
                    case ContentType.DocSet:
                        if (this.incCall() == true) return;
                        this.dataService.getFolder(this).then(
                            response => {
                                this.decCall();
                                if (this.incCall() == true) return;
                                this.dataService.copyDocSet(this).then(
                                    response => {
                                        this.decCall();
                                        if (this.incCall() == true) return;
                                        this.dataService.readListItem(this).then(
                                            response => {
                                                this.decCall();
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
                                                        this.parent.done(this, "List Fields couldn't be set: " + response);
                                                    });
                                            },
                                            response => {
                                                this.decCall();
                                                this.status = "Error";
                                                this.parent.done(this, "List Fields couldn't be read: " + response);
                                            });
                                    },
                                    response => {
                                        this.decCall();
                                        this.status = "Error";
                                        this.parent.done(this, "Document Set couldn't be copied: " + response);
                                    })
                            },
                            response => {
                                this.decCall();
                                this.status = "Error";
                                this.parent.done(this, "Document Set couldn't be read: " + response);
                            });
                        break;

                    default:
                        this.decCall();
                        this.status = "Error";
                        this.parent.done(this, "Format is unknown.");
                        break;
                }
            },
            response => {
                this.decCall();
                this.status = "Error";
                this.parent.done(this, "Couldn't read Content Type: " + response);
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
        if (that.parent.currentCalls >= that.parent.maxCalls) {
            that.status= "Waiting";
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
        this.status="Copying";
        return false;
    }

    decCall() {
        this.parent.currentCalls--;
    }


}