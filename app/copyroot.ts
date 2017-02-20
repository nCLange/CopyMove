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
    targetName: string;
    srcListUrl: string;
    readCounter: number;
    //fileAmount: number;
    ready: boolean;
    hasError: boolean;
    rootItems: Array<ItemDL>; // first items


    constructor(delafter: boolean, parent: any) {

        this.errorReport = [];
        this.targetUrl = SiteCollection.targetPath;
        this.targetTitle = DocumentLibrary.targetTitle;
        this.targetName = DocumentLibrary.targetName;
        this.srcListUrl = DocumentLibrary.srcListUrl;
        this.targetRootPath = "";
        this.rootFolder = null;
        this.dataService = new DataService();
        this.maxCalls = 1;
        this.currentCalls = 0;
        this.srcUrl = _spPageContextInfo.webAbsoluteUrl;
        this.fields = [];
        this.canceled = false;
        this.items = []; //Array of items to be copied
        this.doneCounter = 0; //counter of what finished copying
        this.readCounter = 0; //counter of what is read
        // this.fileAmount = 0;
        this.parent = parent;
        this.delafter = delafter;
        this.ready = false; //Is ready to do rest of the copying
        this.hasError = false; // An Error was found 
        this.rootItems = [];

        this.srcListId = new RegExp('[\?&]SPListId=([^&#]*)').exec(window.location.href)[1];

        var tempItemIds = new RegExp('[\?&]SPListItemId=([^&#]*)').exec(window.location.href);
        this.selectedItemIds = tempItemIds[1].split(",").map(Number);
        this.dataService.getListInfoFromId(this).then(
            response => {
                this.dataService.getListPermission(this.srcUrl, this.srcListId, false).then(response => {
                    if (!(response as SP.BasePermissions).has(SP.PermissionKind.viewListItems)) {
                        this.cancel("Keine Berechtigung den Listeninhalt in der Quellbibliothek zu lesen");
                        return;
                    }
                    if (!(response as SP.BasePermissions).has(SP.PermissionKind.deleteListItems) && this.delafter) {
                        this.cancel("Keine Berechtigung die Listenelemente in der Quellbibliothek zu löschen");
                        return;
                    }

                    this.dataService.getListPermission(this.targetUrl, this.targetTitle, true).then(response => {
                        if (!(response as SP.BasePermissions).has(SP.PermissionKind.viewListItems)) {
                            this.cancel("Keine Berechtigung den Listeninhalt in der Zielbibliothek zu lesen");
                            return;
                        }
                        if (!(response as SP.BasePermissions).has(SP.PermissionKind.addListItems)) {
                            this.cancel("Keine Berechtigung die Listenelemente in der Zielbibliothek zu erstellen");
                            return;
                        }
                        if (!(response as SP.BasePermissions).has(SP.PermissionKind.editListItems)) {
                            this.cancel("Keine Berechtigung die Listenelemente in der Zielbibliothek zu editieren");
                            return;
                        }

                        this.srcRootPath = this.srcRootPath.replace(_spPageContextInfo.siteServerRelativeUrl + "/" + this.name, "");
                        if (this.srcRootPath != "") {
                            this.srcRootPath += "/";
                            this.srcRootPath = this.srcRootPath.substr(1, this.srcRootPath.length);
                        }

                        if (Directory.selectedPath != undefined && Directory.selectedPath != "" && Directory.selectedPath != null) {
                            this.targetRootPath = Directory.selectedPath;
                            this.dataService.getFolderFromUrl(this).then(
                                response => {
                                    for (var id = 0; id < this.selectedItemIds.length; id++) {
                                        var item = new ItemDL(this.selectedItemIds[id], this, this.targetRootPath, this.srcRootPath, this.rootFolder.get_listItemAllFields().get_id())
                                        this.items.push(item);
                                        this.rootItems.push(item);
                                    }
                                },
                                response => { console.log("getFolderFromUrl Error " + response); });
                        }
                        else {
                            for (var id = 0; id < this.selectedItemIds.length; id++) {
                                var item = new ItemDL(this.selectedItemIds[id], this, "", this.srcRootPath)
                                this.items.push(item);
                                this.rootItems.push(item);
                            }
                        }
                    },
                        response => {
                            console.log("getPermissionErrorTarget " + response)
                        }
                    );
                }, response => { console.log("getPermissionErrorSrc " + response) });
            }, response => {
                console.log("getListInfoFromIdError" + response)
            });

    }

    addToArray(id: number, targetFolderURL: string, srcFolderURL: string, parentFolderId: number) {
        var item = new ItemDL(id, this, targetFolderURL, srcFolderURL, parentFolderId);
        this.items.push(item);
        return item;
    }

    done(caller: ItemDL, errorMsg) {
        if (errorMsg != null && errorMsg != "") {
            this.errorReport.push(caller.name + ": " + errorMsg);
        }
        this.doneCounter++;
        if (this.doneCounter >= this.items.length) {
            if (this.delafter) {
                var error = false;

                if (this.hasError == false) {
                    for (var i = this.items.length - 1; i >= 0; i--) {
                        if (this.items[i].status == "Done" && this.items[i].type == ContentType.File) {
                            if (error == false)
                                this.items[i].dataService.deleteEntry(this.items[i]).then(response => { }, response => { console.log(response); error = true; });
                        }
                        else if (this.items[i].status != "Done" && this.items[i].type == ContentType.File) {
                            error = true;
                        }
                        else if (this.items[i].status == "Done" && this.items[i].type != ContentType.File) {
                            if (error == false)
                                this.items[i].dataService.deleteEntry(this.items[i]).then(response => { }, response => { console.log(response); error = true; });
                        }
                        else {
                            error = true;
                        }
                    }
                }
            }
            this.parent.screen = 2;
        }
    }

    cancel(errorMsg) {
        if (errorMsg != null && errorMsg != "") {
            this.errorReport.push(errorMsg);
        }
        this.parent.screen = 2;
    }
}
