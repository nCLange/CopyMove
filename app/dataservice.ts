﻿import {Injectable} from '@angular/core';
import {SiteCollection} from './sitecollection';
import {DocumentLibrary} from './documentlibrary';
import {Directory} from './directory';
import {ItemDL, ContentType} from './itemdl';
import {CopyRoot} from './copyroot';
import {ListField} from './listFields';
import {FieldContent} from './fieldcontent';
//import {Observable} from 'rxjs/Observable';
//import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

    private appWebUrl;
    private searchWebUrl;

    constructor() {
        this.appWebUrl = _spPageContextInfo.webAbsoluteUrl;
        this.searchWebUrl = this.appWebUrl;
    }

    getListPermission(url, title, isTitle) {
        var ctx = new SP.ClientContext(url);
        var web = ctx.get_web();
        var list;
        if (isTitle)
            list = web.get_lists().getByTitle(title);
        else
            list = web.get_lists().getById(title);

        var user = web.get_currentUser();

        ctx.load(user);
        ctx.load(list, "EffectiveBasePermissions");

        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                function () {
                    // var permission = list.getUserEffectivePermissions(user.get_loginName());
                    var permission = list.get_effectiveBasePermissions();
                    resolve(permission);
                },
                function () {
                    reject(arguments[1].get_message());
                });
        });
    }

    getListInfoFromId(caller: CopyRoot) {

        var ctx = SP.ClientContext.get_current();
        var srcList = ctx.get_web().get_lists().getById(caller.srcListId);
        var fieldcollection = srcList.get_fields();
        var folder: any;
        var rootFolder = srcList.get_rootFolder();
        var listItem = srcList.getItemById(caller.selectedItemIds[0]);

        ctx.load(srcList);
        ctx.load(fieldcollection);
        ctx.load(rootFolder);
        ctx.load(listItem);

        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                function () {

                    caller.name = rootFolder.get_serverRelativeUrl().replace(srcList.get_parentWebUrl() + "/", '');
                    caller.title = srcList.get_title();
                    for (var i = 0; i < fieldcollection.get_count(); i++) {
                        if (!fieldcollection.itemAt(i).get_fromBaseType() && !fieldcollection.itemAt(i).get_hidden()) {
                            var listField = new ListField(fieldcollection.itemAt(i).get_internalName(), fieldcollection.itemAt(i).get_typeAsString());
                            if (listField.allowed)
                                caller.fields.push(listField);
                        }
                    }

                    var file = !(listItem.get_fileSystemObjectType() == SP.FileSystemObjectType.folder);
                    if (!file) {
                        folder = listItem.get_folder().get_parentFolder();
                    }
                    else
                        folder = listItem.get_file();

                    ctx.load(folder);
                    ctx.executeQueryAsync(
                        function () {
                            if (!file)
                                caller.srcRootPath = folder.get_serverRelativeUrl();
                            else
                                caller.srcRootPath = (folder.get_serverRelativeUrl() as string).substr(0, folder.get_serverRelativeUrl().lastIndexOf("/"));
                            resolve();
                        },
                        function () {
                            reject(arguments[1].get_message());
                        }
                    );
                },
                function () {
                    reject(arguments[1].get_message());
                });
        });
    }

    getFolderFromUrl(caller: CopyRoot) {

        var ctx = new SP.ClientContext(caller.targetUrl);
        var currentFolder = ctx.get_web().getFolderByServerRelativeUrl(caller.targetUrl + "/" + caller.targetName + "/" + caller.targetRootPath);
        //console.log(caller.targetTitle+"/"+caller.targetRootPath);
        ctx.load(currentFolder);
        ctx.load(currentFolder, "ListItemAllFields");
        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                function () {
                    caller.rootFolder = currentFolder;
                    //  caller.name = currentFolder.ge
                    resolve();

                },
                function () {
                    reject(arguments[1].get_message());
                });
        });
    }

    searchSiteCollection(caller) {
        var type = "";
        let that = this;
        var relUrl = _spPageContextInfo.siteServerRelativeUrl.substr(1);
        var stringindex = relUrl.indexOf("/");
        type = relUrl.substr(stringindex + 1, 3);

        return new Promise(function (resolve, reject) {

            $.getScript(that.searchWebUrl + "/_layouts/15/SP.RequestExecutor.js").done(function (script, textStatus) {

                var executor = new SP.RequestExecutor(that.appWebUrl);
                executor.executeAsync(
                    {
                        url: that.searchWebUrl + "/_api/search/query?querytext='contentclass:sts_site'&trimduplicates=false&selectproperties'Title,Path'&rowlimit=500&sourceid='8413cd39-2156-4e00-b54d-11efd9abdb89'",
                        method: "GET",
                        headers: { "Accept": "application/json; odata=verbose" },
                        success: function (data) {
                            var myoutput = JSON.parse((data.body.toString()));
                            var sitecollection = [];
                            try {
                                var siteResult = myoutput.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
                                for (var x = 0; x < siteResult.length; x++) {
                                    // if (that.searchJSONForValue(siteResult[x].Cells.results, "Path").includes("/profile/" + type))
                                    sitecollection.push(
                                        new SiteCollection(that.searchJSONForValue(siteResult[x].Cells.results, "Title"), that.searchJSONForValue(siteResult[x].Cells.results, "Path"), caller));
                                }
                            }
                            catch (err) { var sitecollection = []; reject(err); }
                            sitecollection.sort(function (a, b) { return a.name.toLowerCase().localeCompare(b.name.toLowerCase()); })
                            resolve(sitecollection);
                        },
                        error: function (data) {
                            console.log(data);
                            var sitecollection = [];
                            reject(sitecollection);
                        }
                    }
                )
            });
        });
    }

    getDocLibInfo(parent, pathURL, guid) {

        let that = this;
        var ctx = new SP.ClientContext(pathURL);
        var list = ctx.get_web().get_lists().getById(guid);
        var documentlibraries = [];

        ctx.load(list);

        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                function () {
                    // var list = listenum.get_current();
                    var name = "";
                    if (list.get_documentTemplateUrl()) {
                        name = list.get_documentTemplateUrl().substr(0, list.get_documentTemplateUrl().lastIndexOf("/Forms/"));
                        name = name.replace(list.get_parentWebUrl() + "/", '');
                    }
                    else {
                        var stringtoDecode = list.get_entityTypeName();
                        stringtoDecode = stringtoDecode.replace(/_x002f_/g, "/");
                        stringtoDecode = stringtoDecode.replace(/_x002d_/g, "-");
                        stringtoDecode = stringtoDecode.replace(/_x0020_/g, " ");
                        stringtoDecode = stringtoDecode.replace(/_x0028_/g, "(");
                        stringtoDecode = stringtoDecode.replace(/_x0029_/g, ")");
                        stringtoDecode = stringtoDecode.replace(/_x0023_/g, "#");
                        stringtoDecode = stringtoDecode.replace(/_x002e_/g, ".");
                        name = stringtoDecode;
                    }
                    var doclib = new DocumentLibrary(name, list.get_title(), list.get_entityTypeName(), parent);
                    resolve(doclib);
                },
                function (data) {
                    console.log(data);
                    reject(data);
                });
        });
    }

    searchDocLibFilter(caller, input, curProm) {
        var type = "";
        let that = this;
        var relUrl = _spPageContextInfo.siteServerRelativeUrl.substr(1);
        var stringindex = relUrl.indexOf("/");
        type = relUrl.substr(stringindex + 1, 3);
        // console.log(type);
        var documentlibraries = [];
        var siteCollections: Array<SiteCollection> = [];

        return new Promise(function (resolve, reject) {

            $.getScript(that.searchWebUrl + "/_layouts/15/SP.RequestExecutor.js").done(function (script, textStatus) {

                var executor = new SP.RequestExecutor(that.appWebUrl);
                executor.executeAsync(
                    {
                        url: that.searchWebUrl + "/_api/search/query?querytext='Title:*" + input + "* contentclass:sts_list_documentlibrary'&trimduplicates=false&selectproperties='Title,Path,SiteName,ListID'&rowlimit=500&sourceid='8413cd39-2156-4e00-b54d-11efd9abdb89'",
                        method: "GET",
                        headers: { "Accept": "application/json; odata=verbose" },
                        success: function (data) {
                            var myoutput = JSON.parse((data.body.toString()));
                            var docResult = myoutput.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
                            console.log(docResult);
                            for (var x = 0; x < docResult.length; x++) {
                                /*   if (!path.includes("/profile/" + type))
                                    continue;*/
                                var siteName: string = that.JSONObjectHelper(docResult[x].Cells.results, "SiteName");
                                var guid = that.JSONObjectHelper(docResult[x].Cells.results, "ListID");

                                var siteColName = siteName.substr(siteName.lastIndexOf("/") + 1, siteName.length - siteName.lastIndexOf("/") - 1);
                                var founddocLib = false;
                                for (var i = 0; i < siteCollections.length; i++) {
                                    if (siteCollections[i].path == siteName) {
                                        siteCollections[i].createDocLib(guid);
                                        founddocLib = true;
                                        break;
                                    }
                                }
                                if (founddocLib == false) {
                                    siteCollections.push(new SiteCollection(siteColName, siteName, caller));
                                    siteCollections[siteCollections.length - 1].createDocLib(guid);
                                }
                            }
                            var output = [curProm, siteCollections];
                            resolve(output);
                        },
                        error: function (data) {
                            var sitecollection = [];
                            var output = [curProm, sitecollection];
                            reject(output);
                        }
                    });
            });
        });
    }

    JSONObjectHelper(inputArray, key) {
        for (var i = 0; i < inputArray.length; i++) {
            if (inputArray[i].Key == key) {
                return inputArray[i].Value;
            }
        }
        return null;
    }

    searchDocumentLibrary3(pathURL, parent) {

        let that = this;

        var ctx = new SP.ClientContext(pathURL);
        var lists = ctx.get_web().get_lists();
        var documentlibraries = [];

        ctx.load(lists);

        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                function () {
                    var listenum = lists.getEnumerator();
                    while (listenum.moveNext()) {
                        var list = listenum.get_current();
                        if (list.get_baseTemplate() == 101) {
                            var name = "";
                            if (list.get_documentTemplateUrl()) {
                                name = list.get_documentTemplateUrl().substr(0, list.get_documentTemplateUrl().lastIndexOf("/Forms/"));
                                name = name.replace(list.get_parentWebUrl() + "/", '');
                            }
                            else {
                                var stringtoDecode = list.get_entityTypeName();
                                stringtoDecode = stringtoDecode.replace(/_x002f_/g, "/");
                                stringtoDecode = stringtoDecode.replace(/_x002d_/g, "-");
                                stringtoDecode = stringtoDecode.replace(/_x0020_/g, " ");
                                stringtoDecode = stringtoDecode.replace(/_x0028_/g, "(");
                                stringtoDecode = stringtoDecode.replace(/_x0029_/g, ")");
                                stringtoDecode = stringtoDecode.replace(/_x0023_/g, "#");
                                stringtoDecode = stringtoDecode.replace(/_x002e_/g, ".");
                                name = stringtoDecode;
                            }
                            if (list.get_title() != "App Packages" && list.get_title() != "Style Library" && list.get_title() != "Site Assets" && list.get_title() != "Websiteobjekte" && list.get_title() != "SiteAssets")
                                documentlibraries.push(new DocumentLibrary(name, list.get_title(), list.get_entityTypeName(), parent));
                        }
                    }
                    documentlibraries.sort(function (a, b) { return a.title.toLowerCase().localeCompare(b.title.toLowerCase()); })
                    resolve(documentlibraries);
                },
                function (data) {
                    console.log(data);
                    reject([]);
                });
        });
    }

    searchDirectories(pathUrl, relPath, parent) {

        let that = this;
        return new Promise(function (resolve, reject) {
            $.getScript(pathUrl + "/_layouts/15/SP.RequestExecutor.js").done(function (script, textStatus) {
                var executor = new SP.RequestExecutor(that.appWebUrl);

                executor.executeAsync(
                    {

                        url: pathUrl + "/_api/web/GetFolderByServerRelativeUrl('" + relPath + "')/Folders?$expand=ListItemAllFields",

                        method: "GET",
                        headers: { "Accept": "application/json; odata=verbose" },
                        success: function (data) {
                            var myoutput = JSON.parse((data.body.toString()));
                            var directory = [];

                            var siteResult = myoutput.d.results;
                            for (var x = 0; x < siteResult.length; x++) {
                                if (siteResult[x].Name != "Forms" && !siteResult[x].ListItemAllFields.ContentTypeId.startsWith("0x0120D520"))
                                    directory.push(
                                        new Directory(siteResult[x].Name, parent));
                            }
                            directory.sort(function (a, b) { return a.name.toLowerCase().localeCompare(b.name.toLowerCase()); })
                            resolve(directory);
                        },
                        error: function (data) {
                            var directory = [];
                            console.log("Error");
                            console.log(data);
                            reject(directory);
                        }
                    });
            });
        });
    }

    private searchJSONForValue(input: any, key: string) {
        input = JSON.stringify(input);
        input = input.match("Key\":\"" + key + ".*?}").toString();
        input = input.match("(?=Value\":\").*?(?=\",)").toString().substring(8);
        return (input.toString() as string);
    }

    private searchJSONWebApi(input: any, key: string) {
        input = JSON.stringify(input);
        input = input.match("(?=\"" + key + "\":\").*?(?=\",)").toString().substring(key.length + 4);
        return input.toString();
    }

    getElementById(pathUrl, listTitle, id, parent) {
        var executor = new SP.RequestExecutor(this.appWebUrl);
        let that = this;

        return new Promise(function (resolve, reject) {
            executor.executeAsync(
                {
                    url: pathUrl + "/_api/web/lists/GetByTitle('" + listTitle + "')/items(" + id + ")",
                    method: "GET",
                    headers: { "Accept": "application/json; odata=verbose" },
                    success: function (data) {
                        var myoutput = JSON.parse((data.body.toString()));
                        var itemdl = [];
                        var siteResult = myoutput.d;

                        for (var x = 0; x < siteResult.length; x++) {
                            itemdl.push(
                                new ItemDL(id, parent)
                            );
                        }

                        resolve(itemdl);
                    },
                    error: function (data) {
                        var directory = [];
                        reject(directory);
                    }
                });
        });
    }

    buildSoapEnvelope(caller: ItemDL) {
        var line = "";
        line += "<?xml version= \"1.0\" encoding= \"utf-8\" ?>";
        line += "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">";
        line += "<soap12:Body>";
        line += "<CopyIntoItemsLocal xmlns=\"http://schemas.microsoft.com/sharepoint/soap/\">";
        line += "<SourceUrl>" + caller.parent.srcUrl + "/" + caller.parent.name + "/" + caller.srcFolderURL + caller.name + "</SourceUrl>";
        line += "<DestinationUrls>";
        line += "<string>" + caller.parent.targetUrl + "/" + caller.parent.targetName + "/" + caller.targetFolderURL + caller.name + "</string>";
        line += "</DestinationUrls>";
        line += "</CopyIntoItemsLocal>";
        line += "</soap12:Body>";
        line += "</soap12:Envelope>";

        return line;
    }

    buildCustomSoapEnvelope(caller: ItemDL) {
        var line = "";
        line += "<?xml version= \"1.0\" encoding= \"utf-8\" ?>";
        line += "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">";
        line += "<soap12:Body>";
        line += "<CopyIntoItemsLocal xmlns=\"http://schemas.microsoft.com/sharepoint/soap/\">";
        line += "<SourceUrl>" + caller.parent.srcUrl + "/" + caller.parent.name + "/" + caller.srcFolderURL + caller.name + "</SourceUrl>";
        line += "<DestinationUrls>";
        line += "<string>" + caller.parent.targetUrl + "/" + caller.parent.targetName + "/" + caller.targetFolderURL + caller.name + "</string>";
        line += "</DestinationUrls>";
        line += "</CopyIntoItemsLocal>";
        line += "</soap12:Body>";
        line += "</soap12:Envelope>";

        return line;
    }

    customSoapAjax(caller: ItemDL) {
        let that = this;
        var xmlstring = this.buildCustomSoapEnvelope(caller);
        return new Promise(function (resolve, reject) {
            jQuery.ajax({
                url: "http://localhost:2991/copy.asmx",
                type: "POST",
                dataType: "xml",
                data: xmlstring,
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                contentType: "application/soap+xml; charset=utf-8",
                headers: { "Accept": "application/xml; odata=verbose" },
                success: function (xData, status) {
                    that.getListIDFromFile(caller).then(
                        response => { resolve(); },
                        response => { reject(response); }
                    );
                },
                error: function (xData, status) {
                    console.log(xData);
                    reject(status);
                },
            });
        });
    }

    soapAjax(caller: ItemDL) {
        let that = this;
        var xmlstring = this.buildSoapEnvelope(caller);
        return new Promise(function (resolve, reject) {
            jQuery.ajax({
                url: caller.parent.srcUrl + "/_vti_bin/copy.asmx",
                type: "POST",
                dataType: "xml",
                data: xmlstring,
                xhrFields: {
                    withCredentials: true
                },
                contentType: "application/soap+xml; charset=utf-8",
                success: function (xData, status) {
                    var soapResult = $(xData).find('CopyResult');
                    if (soapResult.attr("ErrorCode") != "Success") {
                        reject(soapResult.attr("ErrorCode") + "-" + soapResult.attr("ErrorMessage"));
                        return;
                    }
                    that.getListIDFromFile(caller).then(
                        response => { resolve(); },
                        response => { reject(response); }
                    );
                },
                error: function (xData, status) {
                    console.log(xData);
                    reject(xData + " " + status);
                },
            });
        });
    }

    getListIDFromFile(caller: ItemDL) {
        var ctx = new SP.ClientContext(caller.parent.targetUrl);

        var file = ctx.get_web().getFileByServerRelativeUrl("/" + caller.parent.targetUrl.replace(/^(?:\/\/|[^\/]+)*\//, "") + "/" + caller.parent.targetName + "/" + caller.targetFolderURL + caller.name);

        ctx.load(file, 'ListItemAllFields');
        ctx.load(file);

        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                function () {
                    caller.targetId = file.get_listItemAllFields().get_id();
                    resolve()
                },
                function () {
                    reject(arguments[1].get_message());
                });
        });
    }

    getContent(caller: ItemDL) {
        let that = this;

        var ctx = new SP.ClientContext(caller.parent.srcUrl);
        var listItem: SP.ListItem = ctx.get_web().get_lists().getByTitle(caller.parent.title).getItemById(caller.id);
        var cType = listItem.get_contentType();

        ctx.load(listItem);
        ctx.load(cType);

        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                function () {
                    if (listItem.get_fileSystemObjectType() == SP.FileSystemObjectType.folder) {
                        if (cType.get_id().toString().startsWith("0x0120D520")) {
                            caller.type = ContentType.DocSet;
                            caller.contentTypeId = cType.get_id().toString().substring(0, cType.get_id().toString().length - 34);
                            caller.contentTypeName = cType.get_name();
                        }
                        else {
                            caller.type = ContentType.Folder;
                        }
                    }
                    else if (listItem.get_fileSystemObjectType() == SP.FileSystemObjectType.file) {
                        caller.type = ContentType.File;
                    }
                    else {
                        reject("Unknown Format in" + caller.id);
                    }
                    resolve();
                },
                function () {
                    reject(arguments[1].get_message());
                }
            );
        });
    }

    getFolder(caller: ItemDL) {
        let that = this;

        var ctx = new SP.ClientContext(caller.parent.srcUrl);
        var listItem: SP.ListItem = ctx.get_web().get_lists().getByTitle(caller.parent.title).getItemById(caller.id);
        var files = listItem.get_folder().get_files();
        var folders = listItem.get_folder().get_folders();
        var folder = listItem.get_folder();

        ctx.load(listItem);
        ctx.load(folder);
        ctx.load(files, 'Include(ListItemAllFields)');
        ctx.load(folders, 'Include(ListItemAllFields)');

        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                function () {
                    caller.name = folder.get_name();

                    for (var i = 0; i < files.get_count(); i++) {
                        // caller.parent.fileAmount++;
                        caller.addToQueue(files.getItemAtIndex(i).get_listItemAllFields().get_id());
                    }

                    for (var i = 0; i < folders.get_count(); i++) {
                        //caller.parent.fileAmount++;
                        caller.addToQueue(folders.getItemAtIndex(i).get_listItemAllFields().get_id());
                    }

                    caller.targetFolderURL += caller.name + "/";
                    caller.srcFolderURL += caller.name + "/";

                    resolve();

                },
                function () {
                    reject(arguments[1].get_message());
                }
            );
        });
    }

    copyFolder(caller: ItemDL) {
        var targetList: SP.List;
        var listItem: SP.ListItem;
        var ctx = new SP.ClientContext(caller.parent.targetUrl);

        var itemCreateInfo: SP.ListItemCreationInformation;

        targetList = ctx.get_web().get_lists().getByTitle(caller.parent.targetTitle);
        var thisFolder: SP.Folder;
        ctx.load(targetList);

        if (caller.parentFolderId == null) {

            thisFolder = targetList.get_rootFolder().get_folders().add(caller.name);
        }
        else {
            thisFolder = targetList.getItemById(caller.parentFolderId).get_folder().get_folders().add(caller.name);
        } 
        ctx.load(thisFolder, "ListItemAllFields");
        ctx.load(thisFolder);
        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                function () {
                    caller.parentFolderId = thisFolder.get_listItemAllFields().get_id();
                    resolve();

                },
                function (x, args) {
                    reject(arguments[1].get_message());
                }
            );
        });
    }

    copyDocSetByName(caller: ItemDL) {

        let that = this;

        var targetList: SP.List;
        var listItem: SP.ListItem;
        var root: SP.Folder;
        var ctx = new SP.ClientContext(caller.parent.targetUrl);

        targetList = ctx.get_web().get_lists().getByTitle(caller.parent.targetTitle);
        if (caller.parentFolderId == null)
            root = targetList.get_rootFolder();
        else
            root = targetList.getItemById(caller.parentFolderId).get_folder();

        ctx.load(targetList);
        var cTypeId = caller.contentTypeId;
        var newCTs: SP.ContentTypeCollection = ctx.get_web().get_contentTypes();

        ctx.load(root);
        ctx.load(newCTs);

        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                function () {
                    var newCTId = null;
                    for (var i = 0; i < newCTs.get_count(); i++) {
                        if (newCTs.getItemAtIndex(i).get_name() == caller.contentTypeName) {
                            console.log(caller.contentTypeName);
                            newCTId = newCTs.getItemAtIndex(i).get_id();
                            break;
                        }
                    }
                    if (newCTId == null) reject("Content type wasn't found in target Library");
                    SP.DocumentSet.DocumentSet.create(ctx, root, caller.name, newCTId);
                    ctx.executeQueryAsync(
                        function () {
                            that.getFolderFromDocSet(caller).then(
                                response => {
                                    // caller.releaseQueue();
                                    resolve();
                                },
                                response => {
                                    reject("0:" + response)
                                });
                        },
                        function () {
                            if (arguments[1].get_message().includes("already exists")) {
                                that.getFolderFromDocSet(caller).then(
                                    response => {
                                        //  caller.releaseQueue();
                                   	    resolve();
                                    },
                                    response => {
                                        reject("2:" + response)
                                    });
                            }
                            else
                                reject("1:" + arguments[1].get_message());
                        });
                },
                function (x, args) {
                    reject("3:" + arguments[1].get_message());
                }
            );
        });
    }

    /*   // Muss die neuen Objekte hier starten um Fehlern vorzubeugen
       copyDocSet(caller: ItemDL) {
   
           let that = this;
   
           var targetList: SP.List;
           var listItem: SP.ListItem;
           var root: SP.Folder;
           var ctx = new SP.ClientContext(caller.parent.targetUrl);
           // var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl);
   
           targetList = ctx.get_web().get_lists().getByTitle(caller.parent.targetTitle);
           if (caller.parentFolderId == null)
               root = targetList.get_rootFolder();
           else
               root = targetList.getItemById(caller.parentFolderId).get_folder();
   
           ctx.load(targetList);
           var cTypeId = caller.contentTypeId;
           var newCT: SP.ContentType = ctx.get_web().get_contentTypes().getById(cTypeId);
   
           ctx.load(root);
           ctx.load(newCT);
   
           return new Promise(function (resolve, reject) {
               ctx.executeQueryAsync(
                   function () {
                       SP.DocumentSet.DocumentSet.create(ctx, root, caller.name, newCT.get_id());
                       ctx.executeQueryAsync(
                           function () {
                               that.getFolderFromDocSet(caller).then(
                                   response => {
                                     //  caller.releaseQueue();
                                       resolve();
                                   },
                                   response => {
                                       reject("0:" + response)
                                   });
                           },
                           function () {
                               if (arguments[1].get_message().includes("already exists")) {
                                   that.getFolderFromDocSet(caller).then(
                                       response => {
                                         //  caller.releaseQueue();
                                                 resolve();
                                       },
                                       response => {
                                           reject("2:" + response)
                                       });
                               }
                               else
                                   reject("1:" + arguments[1].get_message());
                           });
                   },
                   function (x, args) {
                       reject("3:" + arguments[1].get_message());
                   }
               );
           });
       }*/

    getFolderFromDocSet(caller: ItemDL) {

        let that = this;
        var targetList: SP.List;
        var listItem: SP.ListItem;
        var folders: SP.FolderCollection;
        var ctx = new SP.ClientContext(caller.parent.targetUrl);
        targetList = ctx.get_web().get_lists().getByTitle(caller.parent.targetTitle);
        if (caller.parentFolderId == null)
            folders = targetList.get_rootFolder().get_folders();
        else
            folders = targetList.getItemById(caller.parentFolderId).get_folder().get_folders();

        ctx.load(targetList);
        ctx.load(folders, 'Include(ListItemAllFields)');
        ctx.load(folders);

        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                function () {

                    // console.log(folders);
                    for (var i = 0; i < folders.get_count(); i++) {
                        if (folders.getItemAtIndex(i).get_name() == caller.name) {
                            caller.parentFolderId = folders.getItemAtIndex(i).get_listItemAllFields().get_id();
                            caller.targetId = folders.getItemAtIndex(i).get_listItemAllFields().get_id();
                            resolve();
                        }
                    }

                    reject(false);

                },
                function () {
                    reject(arguments[1].get_message());
                }
            );
        });
    }

    readListItem(caller: ItemDL) {
        let that = this;

        var ctx = new SP.ClientContext(caller.parent.srcUrl);
        // var appContextSite = new SP.AppContextSite(ctx, caller.parent.srcUrl);
        var hostweb = ctx.get_web();
        var lists = hostweb.get_lists();
        var listItem: SP.ListItem;
        var file: any;
        ctx.load(hostweb);

        listItem = hostweb.get_lists().getByTitle(caller.parent.title).getItemById(caller.id);
        if (caller.type == ContentType.File)
            file = listItem.get_file();
        else
            file = listItem.get_folder();

        ctx.load(listItem);
        ctx.load(file);

        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                function () {

                    caller.name = file.get_name();
                    caller.srcUrl = file.get_serverRelativeUrl();

                    for (var i = 0; i < caller.parent.fields.length; i++) {
                        caller.contents.push(new FieldContent(listItem.get_item(caller.parent.fields[i].name), caller.parent.fields[i]));
                    }
                    resolve();
                },
                function () {
                    reject(arguments[1].get_message());
                });
        });
    }

    fillListItem(caller: ItemDL) {

        var ctx = new SP.ClientContext(caller.parent.targetUrl);
        // var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl).get_web();
        var targetList = ctx.get_web().get_lists().getByTitle(caller.parent.targetTitle);
        var targetItem = targetList.getItemById(caller.targetId);

        var targets = new Array();

        for (var i = 0; i < caller.contents.length; i++) {
            if (caller.contents[i].field.type == "TaxonomyFieldTypeMulti" || caller.contents[i].field.type == "TaxonomyFieldType")
                targets.push(ctx.castTo(targetList.get_fields().getByInternalNameOrTitle(caller.contents[i].field.name), SP.Taxonomy.TaxonomyField));
            else
                targets.push(targetList.get_fields().getByInternalNameOrTitle(caller.contents[i].field.name));

            ctx.load(targets[i]);

        }
        ctx.load(targetList);
        ctx.load(targetItem);

        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                //Success
                function (data) {

                    for (var i = 0; i < caller.contents.length; i++) {

                        if (caller.contents[i].field.type == "TaxonomyFieldTypeMulti") {

                            var termValues = new SP.Taxonomy.TaxonomyFieldValueCollection(ctx, caller.contents[i].value, (targets[i] as SP.Taxonomy.TaxonomyField));

                            (targets[i] as SP.Taxonomy.TaxonomyField).setFieldValueByValueCollection(targetItem, termValues);

                        }
                        else if (caller.contents[i].field.type == "TaxonomyFieldType") {
                            var termValue = new SP.Taxonomy.TaxonomyFieldValue();
                            if (caller.contents[i].value != null) {
                                termValue.set_label(caller.contents[i].value.get_label());
                                termValue.set_termGuid(caller.contents[i].value.get_termGuid());
                                termValue.set_wssId(-1);

                                (targets[i] as SP.Taxonomy.TaxonomyField).setFieldValueByValue(targetItem, termValue);
                            }
                        }
                        else {
                            targetItem.set_item(caller.contents[i].field.name, caller.contents[i].value);

                        }
                    }

                    targetItem.update();
                    ctx.executeQueryAsync(
                        function () { resolve(); },
                        function () { reject(arguments[1].get_message()); }
                    );
                },
                function (data) {
                    reject(arguments[1].get_message());
                }
            );
        });
    }

    readFile(pathUrl: string) {
        var executor = new SP.RequestExecutor(this.appWebUrl);
        let that = this;

        return new Promise(function (resolve, reject) {
            executor.executeAsync(
                {
                    url: pathUrl + "/_api/web/GetFileByServerRelativeUrl('" + pathUrl + "')/Folders",
                    method: "GET",
                    headers: { "Accept": "application/json; odata=verbose" },
                    success: function (data) {
                        var myoutput = JSON.parse((data.body.toString()));
                        var directory = [];

                        var siteResult = myoutput.d.results;

                        for (var x = 0; x < siteResult.length; x++) {

                            directory.push(
                                new Directory(that.searchJSONWebApi(siteResult[x], "Name"), parent));
                        }

                        resolve(directory);
                    },
                    error: function (data) {
                        var directory = [];
                        reject(directory);
                    }
                }
            )
        });
    }

    deleteEntry(caller: ItemDL) {

        var ctx = new SP.ClientContext(caller.parent.srcUrl);
        var srcList = ctx.get_web().get_lists().getById(caller.parent.srcListId);

        var listItem = srcList.getItemById(caller.id);

        ctx.load(listItem);
        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                function (data) {
                    listItem.deleteObject();
                    ctx.executeQueryAsync(function(){resolve();},function(){reject(arguments[1].get_message())}); 
                   // resolve();
                },
                function (data) {
                    reject(arguments[1].get_message());
                });
        });
    }

    buildSoapEnvelopeDelete(caller: ItemDL) {
        var line = "";
        line += "<?xml version= \"1.0\" encoding= \"utf-8\" ?>";
        line += "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">";
        line += "<soap12:Body>";
        line += "<UpdateListItems xmlns=\"http://schemas.microsoft.com/sharepoint/soap/\">";
        line += "<listName>" + caller.parent.title + "</listName>";
        line += "<updates>";
        line += "<Batch OnError=\"Continue\">";
        line += "<Method ID=\"1\" Cmd=\"Update\">"
        line += "<Field Name =\"ID\">" + caller.targetId + "</Field>";
        line += "<Field Name =\"_CopySource\">\"" + caller.name + "\"</Field>";
        line += "</Method>";
        line += "</Batch>";
        line += "</updates>";
        line += "</UpdateListItems>";
        line += "</soap12:Body>";
        line += "</soap12:Envelope>";

        return line;
    }

    checkCopySource(caller: ItemDL) {
        var ctx = new SP.ClientContext(caller.parent.targetUrl);
        var targetList = ctx.get_web().get_lists().getByTitle(caller.parent.targetTitle);
        var targetItem = targetList.getItemById(caller.targetId);

        ctx.load(targetItem);

        ctx.executeQueryAsync(function (data) {
            console.log(targetItem.get_item("_CopySource"));
        }, function (data) { });

    }
}