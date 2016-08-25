import {DataService} from './dataservice';
import {ItemDL, ContentType} from './itemdl';
import {SiteCollection} from './sitecollection';
import {DocumentLibrary} from './documentlibrary';
import {Directory} from './directory';
import {ListField} from './listfields';



export class CopyRoot {
    srcUrl: string;
    targetUrl: string;
    selectedItemIds: Array<number>;
    title: string;
    name: string;
    fields: Array<ListField>;
    targetTitle: string;
    targetRootPath: string;
    srcRootPath: string;
    rootFolder: SP.Folder;
    maxCalls: number;
    currentCalls: number;
    private deleteAfterwards: boolean;
    dataService: DataService;
    folderString: string;
    siteCol: SiteCollection;
    items: Array<ItemDL>;
    static targetUrlArray: Array<String>;
    srcListId: string;
    canceled: boolean;
    doneCounter: number;
    errorReport: Array<string>;
    parent: any;
    delafter: boolean;
    targetName : string;
    srcListUrl: string;


    constructor(delafter: boolean, /*sitecollections: Array<SiteCollection>,*/ parent: any) {


        this.errorReport = [];
        this.targetUrl = SiteCollection.targetPath;
        this.targetTitle = DocumentLibrary.targetTitle;
        this.targetName = DocumentLibrary.targetName;
        this.srcListUrl = DocumentLibrary.srcListUrl;
        this.targetRootPath = "";
        this.rootFolder = null;
        this.dataService = new DataService();
        this.maxCalls = 3;
        this.currentCalls = 0;
        this.srcUrl = _spPageContextInfo.webAbsoluteUrl;
        this.fields = [];
        this.canceled = false;
        this.items = [];
        this.doneCounter = 0;
        this.parent = parent;
        this.delafter = delafter;


        this.srcListId = new RegExp('[\?&]SPListId=([^&#]*)').exec(window.location.href)[1];
        // var wat = new RegExp('[\?&]SPListURL=([^&#]*)').exec(window.location.href)[1];

        var tempItemIds = new RegExp('[\?&]SPListItemId=([^&#]*)').exec(window.location.href);
        this.selectedItemIds = tempItemIds[1].split(",").map(Number);
        this.dataService.getListInfoFromId(this).then(
            response => {
                this.srcRootPath = this.srcRootPath.replace(_spPageContextInfo.siteServerRelativeUrl + "/" + this.name, "");
                if (this.srcRootPath != "") {
                    this.srcRootPath += "/";
                    this.srcRootPath = this.srcRootPath.substr(1, this.srcRootPath.length);
                }
     //           console.log(this.srcRootPath);

                if (Directory.selectedPath != undefined && Directory.selectedPath != "" && Directory.selectedPath != null) {
                    this.targetRootPath = Directory.selectedPath;
                    this.dataService.getFolderFromUrl(this).then(
                        response => {
                            //  this.items = [];
                            this.deleteAfterwards = delafter;
                            for (var id = 0; id < this.selectedItemIds.length; id++) {
                                this.items.push(new ItemDL(this.selectedItemIds[id], this, this.targetRootPath, this.srcRootPath, this.rootFolder.get_listItemAllFields().get_id()));
                            }
                        },
                        response => { console.log("getFolderFromUrl Error " + response); });

                }
                else {
                    //   this.items = [];
                    this.deleteAfterwards = delafter;
                    for (var id = 0; id < this.selectedItemIds.length; id++) {
                        this.items.push(new ItemDL(this.selectedItemIds[id], this, "", this.srcRootPath));
                    }
                }
            },
            response => {
                console.log("getListInfoFromIdError " + response)

            }

        );

    }

    addToArray(id: number, targetFolderURL: string, srcFolderURL: string, parentFolderId: number) {
        this.items.push(new ItemDL(id, this, targetFolderURL, srcFolderURL, parentFolderId));
    }

    done(caller: ItemDL, errorMsg) {
        if (errorMsg != null && errorMsg != ""){
            this.errorReport.push(caller.name + ": " + errorMsg);
        }
      /*  for(var i=0; i<20; i++)
              this.errorReport.push(i+" Hello");*/

        this.doneCounter++;
        if (this.doneCounter >= this.items.length) {
            if (this.delafter) {
                var error = false;
                for (var i = this.items.length - 1; i >= 0; i--) {
                    if (this.items[i].status == "Done" && this.items[i].type == ContentType.File) {
                        this.items[i].dataService.deleteEntry(this.items[i]);
                    }
                    else if (this.items[i].status != "Done" && this.items[i].type == ContentType.File) {
                        error = true;
                    }
                    else if (this.items[i].status == "Done" && this.items[i].type != ContentType.File) {
                        if (error == false)
                            this.items[i].dataService.deleteEntry(this.items[i]);
                    }
                    else {
                        error = true;
                    }

                    //Behandlung von Level Ordner hinzufügen - niedrigeres Lvl = Abbruch
                }
            }
            this.parent.screen = 2;
        }
    }
}
