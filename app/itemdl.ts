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
        this.name = ".";
        this.status = "Preparing";
       // this.title = " ";

        // this.dataService.getFileAsBufferArray(parent.srcUrl + parent.title, id);

        //    if (this.incCall() == true) return;
        this.dataService.getContent(this).then(
            response => {
                //      this.decCall();
                switch (this.type) {
                    case ContentType.File:
                        //    if (this.incCall() == true) return;
                        this.dataService.readListItem(this).then(
                            response => {
                                //   this.decCall();
                                //  if (this.incCall() == true) return;
                                this.incCall().then(
                                    response => {
                                        this.dataService.soapAjax(this).then(
                                            response => {
                                                this.decCall();
                                                this.status = "Done";
                                                this.parent.done(this, null);
                                            },
                                            response => {
                                                this.decCall();
                                                this.status = "Error";
                                                this.parent.done(this, "File couldn't be copied: " + response);
                                            });
                                    },
                                    response => {
                                        this.decCall();
                                        this.status = "Error";
                                        this.parent.done(this, "Operation Canceled");
                                    });

                            }, response => {
                                //   this.decCall();
                                this.status = "Error";
                                this.parent.done(this, "File couldn't be read: " + response);
                            });
                        break;
                    case ContentType.Folder:
                        //  if (this.incCall() == true) return;
                        this.dataService.getFolder(this).then(
                            response => {
                                //   this.decCall();
                                // if (this.incCall() == true) return;
                                this.dataService.copyFolder(this).then(
                                    response => {
                                        //     this.decCall();
                                        this.status = "Done";
                                        this.parent.done(this, null);
                                    },
                                    response => {
                                        //     this.decCall();
                                        this.status = "Error";
                                        this.parent.done(this, "Folder couldn't be copied: " + response);
                                    })
                            },
                            response => {
                                //     this.decCall();
                                this.status = "Error";
                                this.parent.done(this, "Folder couldn't be read: " + response);
                            });
                        break;
                    case ContentType.DocSet:
                        //      if (this.incCall() == true) return;
                        this.dataService.getFolder(this).then(
                            response => {
                                // this.decCall();
                                //  if (this.incCall() == true) return;
                                this.dataService.copyDocSetByName(this).then(
                                    response => {
                                        //       this.decCall();
                                        //      if (this.incCall() == true) return;
                                        this.dataService.readListItem(this).then(
                                            response => {
                                                //             this.decCall();
                                                //       if (this.incCall() == true) return;
                                                this.dataService.fillListItem(this).then(
                                                    response => {
                                                        //                   this.decCall();
                                                        // this.dataService.fillListItem(this); // Dunno warum Doppelt
                                                        this.status = "Done";
                                                        this.parent.done(this, null);
                                                    },
                                                    response => {
                                                        //     this.decCall();
                                                        this.status = "Error";
                                                        this.parent.done(this, "List Fields couldn't be set: " + response);
                                                    });
                                            },
                                            response => {
                                                //        this.decCall();
                                                this.status = "Error";
                                                this.parent.done(this, "List Fields couldn't be read: " + response);
                                            });
                                    },
                                    response => {
                                        //   this.decCall();
                                        this.status = "Error";
                                        this.parent.done(this, "Document Set couldn't be copied: " + response);
                                    })
                            },
                            response => {
                                //   this.decCall();
                                this.status = "Error";
                                this.parent.done(this, "Document Set couldn't be read: " + response);
                            });
                        break;

                    default:
                        // this.decCall();
                        this.status = "Error";
                        this.parent.done(this, "Format is unknown.");
                        break;
                }
            },
            response => {
                // this.decCall();
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

    /*  timeOut(context) {
          console.log(context.parent.currentCalls+"/"+context.parent.maxCalls);
          if (context.parent.currentCalls >= context.parent.maxCalls) {
              console.log("hello");
              context.status= "Waiting";
              setTimeout(context.timeOut, 50);
              return false;
  
          }
      }*/





    waitfor() {
        let that = this;
        // Check if condition met. If not, re-check later (msec).
        if (that.parent.currentCalls < that.parent.maxCalls) {

            return;
        }
        else {
            that.status = "Waiting";
            // console.log("hello "+that.name);
            window.setTimeout(
                that.waitfor, 100);
        }

        that.waitfor();
    }

    waitForPromise() {
        return new Promise(function (resolve, reject) {
            //let that = this;
            /*        console.log("5");
                    
                    if (this.parent.currentCalls >= this.parent.maxCalls) {
                        setTimeout(function () {
                            console.log("6");
                            reject();
                        }, 1000);
                    }
                    else {
                        console.log("7");
                        resolve();
                    }*/

        });

    }

    /* incCall() {
         if (this.parent.canceled == true) {
             this.status = "Canceled";
             return true;
         }
         console.log("1");
         this.waitForPromise().then(
 
             resolve => {
                 console.log("2");
                 this.parent.currentCalls++;
                 this.status = "Copying";
                 return false;
             },
             resolve => {
                 console.log("3");
                 this.status = "Waiting";
                 this.incCall();
             }
         );
         console.log("4");
         return false;
     }*/

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
            //if (that.parent.currentCalls >= that.parent.maxCalls) {
            /*   inTimeOut();


               setTimeout(function () {
                   that.incCall();
               }, 100);
           }
           else {
               that.parent.currentCalls++;
               that.status = "Copying";
               resolve();
           }*/
        });


    }



    decCall() {
        this.parent.currentCalls--;
    }


}