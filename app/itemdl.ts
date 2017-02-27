import {DataService} from './dataservice';
import {CopyRoot} from './copyroot';
import {FieldContent} from './fieldcontent';

export enum ContentType { File, Folder, DocSet }

export class ItemDL {

    id: number;
    srcguid: any;
    targetguid: any;
    parent: CopyRoot;
    dataService: DataService;
    targetId: number;
    name: string;
    title: string;
    srcUrl: string;
    type: ContentType;
    contentQueue: Array<ItemDL>;
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
        this.contentTypeId = null;
        this.parentFolderId = parentFolderId;
        this.contents = [];
        this.name = ".";
        this.status = "Preparing";
        //  this.parent.fileAmount++;

        this.dataService.getContent(this).then(
            response => {
                switch (this.type) {
                    case ContentType.File:
                        this.dataService.readListItem(this).then(
                            response => {
                                this.ready().then(
                                    response => {
                                        this.status = "Preparing Copying";
                                    }, response => {
                                        if (response == "Cancel") {
                                            this.status = "Canceled";
                                            this.parent.done(this, null);
                                        }
                                        else {
                                            this.parent.hasError = true;
                                            this.status = "Error";
                                            this.parent.done(this, response);
                                        }
                                    });
                            }, response => {
                                this.parent.hasError = true;
                                this.status = "Error";
                                this.parent.done(this, "File couldn't be read: " + response);
                            });
                        break;
                    case ContentType.Folder:
                        this.dataService.getFolder(this).then(
                            response => {
                                this.ready().then(
                                    response => {
                                        this.status = "Preparing Copying";
                                    }, response => {
                                        if (response == "Cancel") {
                                            this.status = "Canceled";
                                            this.parent.done(this, null);
                                        }
                                        else {
                                            this.parent.hasError = true;
                                            this.status = "Error";
                                            this.parent.done(this, response);
                                        }
                                    });
                            },
                            response => {
                                //     this.decCall();
                                this.parent.hasError = true;
                                this.status = "Error";
                                this.parent.done(this, "Folder couldn't be read: " + response);
                            });
                        break;
                    case ContentType.DocSet:
                        this.dataService.getFolder(this).then(
                            response => {
                                this.ready().then(
                                    response => {
                                        this.status = "Preparing Copying";
                                    }, response => {
                                        if (response == "Cancel") {
                                            this.status = "Canceled";
                                            this.parent.done(this, null);
                                        }
                                        else {
                                            this.status = "Error";
                                            this.parent.hasError = true;
                                            this.parent.done(this, response);
                                        }
                                    });
                            },
                            response => {
                                //   this.decCall();
                                this.parent.hasError = true;
                                this.status = "Error";
                                this.parent.done(this, "Document Set couldn't be read: " + response);
                            });
                        break;

                    default:
                        // this.decCall();
                        this.parent.hasError = true;
                        this.status = "Error";
                        this.parent.done(this, "Format is unknown.");
                        break;
                }
            },
            response => {
                // this.decCall();
                this.parent.hasError = true;
                this.status = "Error";
                this.parent.done(this, "Couldn't read Content Type: " + response);
            });
    }

    readyToCopy() {
        this.incCall().then(response => {
            this.status = "Copying";
            switch (this.type) {
                case ContentType.File:
                    this.dataService.soapAjax(this).then(
                        response => {
                            this.decCall();
                            this.status = "Done";
                            this.parent.done(this, null);
                        },
                        response => {
                            this.decCall();
                            this.parent.hasError = true;
                            this.status = "Error";
                            this.parent.done(this, "File couldn't be copied: " + response);
                        });
                    break;
                case ContentType.Folder:
                    this.dataService.copyFolder(this).then(
                        response => {
                            this.decCall();
                            this.status = "Done";
                            this.releaseQueue();
                            this.parent.done(this, null);
                        },
                        response => {
                            this.decCall();
                            this.parent.hasError = true;
                            this.status = "Error";
                            this.parent.done(this, "Folder couldn't be copied: " + response);
                        });
                    break;
                case ContentType.DocSet:
                    this.dataService.copyDocSetByName(this).then(
                        response => {
                            this.dataService.readListItem(this).then(
                                response => {
                                    this.dataService.fillListItem(this).then(
                                        response => {
                                            this.decCall();
                                            this.status = "Done";
                                            this.releaseQueue();
                                            this.parent.done(this, null);
                                        },
                                        response => {
                                            this.decCall();
                                            this.parent.hasError = true;
                                            this.status = "Error";
                                            this.parent.done(this, "List Fields couldn't be set: " + response);
                                        });
                                },
                                response => {
                                    this.decCall();
                                    this.parent.hasError = true;
                                    this.status = "Error";
                                    this.parent.done(this, "List Fields couldn't be read: " + response);
                                });
                        },
                        response => {
                            //   this.decCall();
                            this.decCall();
                            this.parent.hasError = true;
                            this.status = "Error";
                            this.parent.done(this, "Document Set couldn't be copied: " + response);
                        });
                    break;
            }
        },
            response => {
                this.decCall();
                this.parent.hasError = true;
                this.status = "Error";
                this.parent.done(this, "Operation Canceled");
            }
        );
    }

    addToQueue(input: number) {
        // this.contentQueue.push(input);
        this.contentQueue.push(this.parent.addToArray(input, this.targetFolderURL, this.srcFolderURL, this.parentFolderId));
    }

    releaseQueue() {
        for (var x = 0; x < this.contentQueue.length; x++) {
            //  this.parent.addToArray(this.contentQueue[x], this.targetFolderURL, this.srcFolderURL, this.parentFolderId);
            this.contentQueue[x].readyToCopy();
        }
        this.contentQueue = [];
    }

    ready() {
        let outerthat = this;
        this.status = "Ready";
        this.parent.readCounter++;
        return new Promise(function (resolve, reject) {

            let fullURL = outerthat.parent.targetUrl + "/" + outerthat.parent.targetName + "/" + outerthat.targetFolderURL + outerthat.name;
            fullURL = fullURL.replace(window.location.protocol + "//" + window.location.host, "");
            fullURL = decodeURIComponent(fullURL);
            if (fullURL.length > 260) {
                outerthat.parent.hasError = true;
                outerthat.status = "Error";
                reject("Targeturl of the item is " + (fullURL.length - 260) + " signs too long");
                return;
            }

            inTimeOut2();

            function inTimeOut2() {
                let that = outerthat;
                if (that.parent.hasError) {
                    that.status = "Canceled";
                    reject("Cancel");
                }
                else if (that.parent.readCounter >= that.parent.items.length) {
                    if (that.parent.rootItems.indexOf(that) != -1) { that.readyToCopy(); }
                    // that.status="Ready";
                    resolve();
                }
                else {
                    setTimeout(function () {
                        inTimeOut2();
                    }, 1000);
                }
            }

        });
    }

    incCall() {
        let outerThat = this;

        return new Promise(function (resolve, reject) {

            outerThat.status = "Waiting";
            inTimeOut();

            function inTimeOut() {
                let that = outerThat;

                if (that.parent.canceled == true) {
                    that.status = "Canceled";
                    reject();
                }
                if (that.parent.currentCalls >= that.parent.maxCalls) {

                    setTimeout(function () {
                        inTimeOut();
                    }, 100);
                }
                else {
                    that.parent.currentCalls++;
                    that.status = "Copying";
                    resolve();
                }
            }
        });
    }

    decCall() {
        this.parent.currentCalls--;
    }
}