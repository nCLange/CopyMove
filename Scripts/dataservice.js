System.register(['@angular/core', './sitecollection', './documentlibrary', './directory', './itemdl', './listFields', './fieldcontent'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, sitecollection_1, documentlibrary_1, directory_1, itemdl_1, listFields_1, fieldcontent_1;
    var DataService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (sitecollection_1_1) {
                sitecollection_1 = sitecollection_1_1;
            },
            function (documentlibrary_1_1) {
                documentlibrary_1 = documentlibrary_1_1;
            },
            function (directory_1_1) {
                directory_1 = directory_1_1;
            },
            function (itemdl_1_1) {
                itemdl_1 = itemdl_1_1;
            },
            function (listFields_1_1) {
                listFields_1 = listFields_1_1;
            },
            function (fieldcontent_1_1) {
                fieldcontent_1 = fieldcontent_1_1;
            }],
        execute: function() {
            DataService = (function () {
                function DataService() {
                    this.appWebUrl = _spPageContextInfo.webAbsoluteUrl;
                    this.searchWebUrl = window.location.protocol + "//" + window.location.host;
                }
                DataService.prototype.getListInfoFromId = function (caller) {
                    var ctx = new SP.ClientContext(caller.srcUrl);
                    // var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl).get_web();
                    var srcList = ctx.get_web().get_lists().getById(caller.srcListId);
                    var fieldcollection = srcList.get_fields();
                    var folder;
                    var rootFolder = srcList.get_rootFolder();
                    var listItem = srcList.getItemById(caller.selectedItemIds[0]);
                    ctx.load(srcList);
                    ctx.load(fieldcollection);
                    ctx.load(rootFolder);
                    ctx.load(listItem);
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function () {
                            caller.name = rootFolder.get_serverRelativeUrl().replace(srcList.get_parentWebUrl() + "/", '');
                            caller.title = srcList.get_title();
                            var consoleOut = "";
                            //   console.log(rootFolder.get_serverRelativeUrl());
                            //   console.log(srcList.get_parentWebUrl());
                            for (var i = 0; i < fieldcollection.get_count(); i++) {
                                //  if(fieldcollection.itemAt(i).get_internalName()=="_CopySource") console.log("GUID: "+fieldcollection.itemAt(i).get_id());
                                if (!fieldcollection.itemAt(i).get_fromBaseType() && !fieldcollection.itemAt(i).get_hidden()) {
                                    consoleOut += fieldcollection.itemAt(i).get_internalName() + "||" + fieldcollection.itemAt(i).get_title() + "/";
                                    var listField = new listFields_1.ListField(fieldcollection.itemAt(i).get_internalName(), fieldcollection.itemAt(i).get_typeAsString());
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
                            ctx.executeQueryAsync(function () {
                                if (!file)
                                    caller.srcRootPath = folder.get_serverRelativeUrl();
                                else
                                    caller.srcRootPath = folder.get_serverRelativeUrl().substr(0, folder.get_serverRelativeUrl().lastIndexOf("/"));
                                resolve();
                            }, function () {
                                reject(arguments[1].get_message());
                            });
                        }, function () {
                            reject(arguments[1].get_message());
                        });
                    });
                };
                DataService.prototype.getFolderFromUrl = function (caller) {
                    var ctx = new SP.ClientContext(caller.targetUrl);
                    //  var appContextSite = new SP.AppContextSite(ctx, caller.targetUrl);
                    // console.log(caller.targetUrl + "/" + caller.targetTitle+ "/" + caller.targetRootPath);
                    var currentFolder = ctx.get_web().getFolderByServerRelativeUrl(caller.targetUrl + "/" + caller.targetName + "/" + caller.targetRootPath);
                    //console.log(caller.targetTitle+"/"+caller.targetRootPath);
                    ctx.load(currentFolder);
                    ctx.load(currentFolder, "ListItemAllFields");
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function () {
                            caller.rootFolder = currentFolder;
                            //  caller.name = currentFolder.ge
                            resolve();
                        }, function () {
                            reject(arguments[1].get_message());
                        });
                    });
                };
                DataService.prototype.searchSiteCollection = function (caller) {
                    var that = this;
                    return new Promise(function (resolve, reject) {
                        $.getScript(that.searchWebUrl + "/_layouts/15/SP.RequestExecutor.js").done(function (script, textStatus) {
                            var executor = new SP.RequestExecutor(that.appWebUrl);
                            executor.executeAsync({
                                //url: this.appWebUrl + "/_api/SP.AppContextSite(@target)/web/title?@target='" + siteURL + "'", 
                                //Leere Bibliotheken werden ignoriert , beheben?
                                url: that.searchWebUrl + "/_api/search/query?querytext='contentclass:sts_site'&trimduplicates=false&selectproperties'Title,Path'&rowlimit=500&sourceid='8413cd39-2156-4e00-b54d-11efd9abdb89'",
                                method: "GET",
                                headers: { "Accept": "application/json; odata=verbose" },
                                success: function (data) {
                                    var myoutput = JSON.parse((data.body.toString()));
                                    var sitecollection = [];
                                    try {
                                        var siteResult = myoutput.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
                                        //console.log(siteResult);
                                        for (var x = 0; x < siteResult.length; x++) {
                                            if (that.searchJSONForValue(siteResult[x].Cells.results, "Path").includes("/profile/"))
                                                sitecollection.push(new sitecollection_1.SiteCollection(that.searchJSONForValue(siteResult[x].Cells.results, "Title"), that.searchJSONForValue(siteResult[x].Cells.results, "Path"), caller));
                                        }
                                    }
                                    catch (err) {
                                        var sitecollection = [];
                                        reject(err);
                                    }
                                    resolve(sitecollection);
                                },
                                error: function (data) {
                                    var sitecollection = [];
                                    reject(sitecollection);
                                }
                            });
                        });
                    });
                };
                DataService.prototype.searchDocumentLibrary2 = function (pathURL, parent) {
                    //var executor = new SP.RequestExecutor(this.appWebUrl);
                    var that = this;
                    return new Promise(function (resolve, reject) {
                        $.getScript(pathURL + "/_layouts/15/SP.RequestExecutor.js").done(function (script, textStatus) {
                            var executor = new SP.RequestExecutor(that.appWebUrl);
                            executor.executeAsync({
                                //url: this.appWebUrl + "/_api/SP.AppContextSite(@target)/web/title?@target='" + siteURL + "'", 
                                //Leere Bibliotheken werden ignoriert , beheben?
                                url: pathURL + "/_api/web/lists?$expand=rootFolder",
                                method: "GET",
                                headers: { "Accept": "application/json; odata=verbose" },
                                success: function (data) {
                                    var myoutput = JSON.parse((data.body.toString()));
                                    var documentlibraries = [];
                                    var dossierResult = myoutput.d.results;
                                    for (var x = 0; x < dossierResult.length; x++) {
                                        if (dossierResult[x].BaseType == 1 && dossierResult[x].Title != "App Packages" && dossierResult[x].Title != "Documents" && dossierResult[x].Title != "Site Assets" && dossierResult[x].Title != "Translation Packages" && dossierResult[x].Title != "Converted Forms" && dossierResult[x].Title != "Form Templates" && dossierResult[x].Title != "List Template Gallery" && dossierResult[x].Title != "Master Page Gallery" && dossierResult[x].Title != "Site Pages" && dossierResult[x].Title != "Solution Gallery" && dossierResult[x].Title != "Style Library" && dossierResult[x].Title != "Theme Gallery" && dossierResult[x].Title != "Web Part Gallery" && dossierResult[x].Title != "wfpub") {
                                            var name = dossierResult[x].RootFolder.ServerRelativeUrl.replace(dossierResult[x].ParentWebUrl + "/", '');
                                            documentlibraries.push(new documentlibrary_1.DocumentLibrary(name, dossierResult[x].Title, dossierResult[x].EntityTypeName, parent));
                                        }
                                    }
                                    resolve(documentlibraries);
                                },
                                error: function (data) {
                                    var documentlibraries = [];
                                    console.log(data);
                                    reject(documentlibraries);
                                }
                            });
                        });
                    });
                };
                DataService.prototype.searchDirectories = function (pathUrl, relPath, parent) {
                    var that = this;
                    return new Promise(function (resolve, reject) {
                        $.getScript(pathUrl + "/_layouts/15/SP.RequestExecutor.js").done(function (script, textStatus) {
                            var executor = new SP.RequestExecutor(that.appWebUrl);
                            //var executor = new SP.RequestExecutor(pathUrl);
                            executor.executeAsync({
                                url: pathUrl + "/_api/web/GetFolderByServerRelativeUrl('" + relPath + "')/Folders?$expand=ListItemAllFields",
                                //Leere Bibliotheken werden ignoriert , beheben?
                                //url: (pathUrl+"/_api/web/GetFolderByServerRelativeUrl('"+relPath+"')"),
                                method: "GET",
                                headers: { "Accept": "application/json; odata=verbose" },
                                success: function (data) {
                                    var myoutput = JSON.parse((data.body.toString()));
                                    var directory = [];
                                    var siteResult = myoutput.d.results;
                                    for (var x = 0; x < siteResult.length; x++) {
                                        if (siteResult[x].Name != "Forms" && !siteResult[x].ListItemAllFields.ContentTypeId.startsWith("0x0120D520"))
                                            directory.push(new directory_1.Directory(siteResult[x].Name, parent));
                                    }
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
                };
                DataService.prototype.searchJSONForValue = function (input, key) {
                    input = JSON.stringify(input);
                    input = input.match("Key\":\"" + key + ".*?}").toString();
                    input = input.match("(?=Value\":\").*?(?=\",)").toString().substring(8);
                    return input.toString();
                };
                DataService.prototype.searchJSONWebApi = function (input, key) {
                    input = JSON.stringify(input);
                    input = input.match("(?=\"" + key + "\":\").*?(?=\",)").toString().substring(key.length + 4);
                    return input.toString();
                };
                DataService.prototype.getElementById = function (pathUrl, listTitle, id, parent) {
                    var executor = new SP.RequestExecutor(this.appWebUrl);
                    var that = this;
                    return new Promise(function (resolve, reject) {
                        executor.executeAsync({
                            url: pathUrl + "/_api/web/lists/GetByTitle('" + listTitle + "')/items(" + id + ")",
                            method: "GET",
                            headers: { "Accept": "application/json; odata=verbose" },
                            success: function (data) {
                                var myoutput = JSON.parse((data.body.toString()));
                                var itemdl = [];
                                var siteResult = myoutput.d;
                                for (var x = 0; x < siteResult.length; x++) {
                                    itemdl.push(new itemdl_1.ItemDL(id, parent));
                                }
                                resolve(itemdl);
                            },
                            error: function (data) {
                                var directory = [];
                                reject(directory);
                            }
                        });
                    });
                };
                DataService.prototype.buildSoapEnvelope = function (caller) {
                    var line = "";
                    line += "<?xml version= \"1.0\" encoding= \"utf-8\" ?>";
                    line += "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">";
                    line += "<soap12:Body>";
                    line += "<CopyIntoItemsLocal xmlns=\"http://schemas.microsoft.com/sharepoint/soap/\">";
                    line += "<SourceUrl>" + caller.parent.srcUrl + "/" + caller.parent.name + "/" + caller.srcFolderURL + caller.name + "</SourceUrl>";
                    // line += "<SourceUrl>"+ caller.name + "</SourceUrl>";
                    // line += "<SourceUrl>http://win-iprrvsfootq/sites/dev/DocaDoca/testing.txt</SourceUrl>";
                    line += "<DestinationUrls>";
                    //   line += "<string>http://win-iprrvsfootq/sites/dev/DocumentTest1/testing.txt</string>";
                    line += "<string>" + caller.parent.targetUrl + "/" + caller.parent.targetName + "/" + caller.targetFolderURL + caller.name + "</string>";
                    line += "</DestinationUrls>";
                    line += "</CopyIntoItemsLocal>";
                    line += "</soap12:Body>";
                    line += "</soap12:Envelope>";
                    return line;
                };
                DataService.prototype.buildCustomSoapEnvelope = function (caller) {
                    var line = "";
                    line += "<?xml version= \"1.0\" encoding= \"utf-8\" ?>";
                    line += "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">";
                    line += "<soap12:Body>";
                    line += "<CopyIntoItemsLocal xmlns=\"http://schemas.microsoft.com/sharepoint/soap/\">";
                    line += "<SourceUrl>" + caller.parent.srcUrl + "/" + caller.parent.name + "/" + caller.srcFolderURL + caller.name + "</SourceUrl>";
                    // line += "<SourceUrl>"+ caller.name + "</SourceUrl>";
                    // line += "<SourceUrl>http://win-iprrvsfootq/sites/dev/DocaDoca/testing.txt</SourceUrl>";
                    line += "<DestinationUrls>";
                    //   line += "<string>http://win-iprrvsfootq/sites/dev/DocumentTest1/testing.txt</string>";
                    line += "<string>" + caller.parent.targetUrl + "/" + caller.parent.targetName + "/" + caller.targetFolderURL + caller.name + "</string>";
                    line += "</DestinationUrls>";
                    line += "</CopyIntoItemsLocal>";
                    line += "</soap12:Body>";
                    line += "</soap12:Envelope>";
                    return line;
                };
                DataService.prototype.customSoapAjax = function (caller) {
                    var that = this;
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
                                that.getListIDFromFile(caller).then(function (response) { resolve(); }, function (response) { reject(response); });
                            },
                            error: function (xData, status) {
                                console.log(xData);
                                reject(status);
                            },
                        });
                    });
                };
                DataService.prototype.soapAjax = function (caller) {
                    var that = this;
                    console.log(caller.parent.srcUrl + "/" + caller.parent.name + "/" + caller.srcFolderURL + caller.name);
                    console.log(caller.parent.targetUrl + "/" + caller.parent.targetName + "/" + caller.targetFolderURL + caller.name);
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
                                console.log("returnData:");
                                console.log(xData);
                                that.getListIDFromFile(caller).then(function (response) { resolve(); }, function (response) { reject(response); });
                            },
                            error: function (xData, status) {
                                console.log(xData);
                                reject(xData + " " + status);
                            },
                        });
                    });
                };
                DataService.prototype.getListIDFromFile = function (caller) {
                    var ctx = new SP.ClientContext(caller.parent.targetUrl);
                    //var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl);
                    var file = ctx.get_web().getFileByServerRelativeUrl("/" + caller.parent.targetUrl.replace(/^(?:\/\/|[^\/]+)*\//, "") + "/" + caller.parent.targetName + "/" + caller.targetFolderURL + caller.name);
                    ctx.load(file, 'ListItemAllFields');
                    ctx.load(file);
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function () {
                            caller.targetId = file.get_listItemAllFields().get_id();
                            resolve();
                        }, function () {
                            reject(arguments[1].get_message());
                        });
                    });
                };
                DataService.prototype.getContent = function (caller) {
                    //      var targetLib = caller.parent.targetTitle;
                    var that = this;
                    var listItem;
                    var ctx = new SP.ClientContext(caller.parent.srcUrl);
                    // var appContextSite = new SP.AppContextSite(ctx, caller.parent.srcUrl);
                    listItem = ctx.get_web().get_lists().getByTitle(caller.parent.title).getItemById(caller.id);
                    var cType = listItem.get_contentType();
                    ctx.load(listItem);
                    ctx.load(cType);
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function () {
                            if (listItem.get_fileSystemObjectType() == SP.FileSystemObjectType.folder) {
                                if (cType.get_id().toString().startsWith("0x0120D520")) {
                                    // console.log("Doc Set: " + caller.id);
                                    caller.type = itemdl_1.ContentType.DocSet;
                                    //console.log(cType.get_id().toString().substring(0, cType.get_id().toString().length - 34));
                                    caller.contentTypeId = cType.get_id().toString().substring(0, cType.get_id().toString().length - 34);
                                    caller.contentTypeName = cType.get_name();
                                }
                                else {
                                    // console.log("Folder: " + caller.id);
                                    caller.type = itemdl_1.ContentType.Folder;
                                }
                            }
                            else if (listItem.get_fileSystemObjectType() == SP.FileSystemObjectType.file) {
                                //console.log("File: " + caller.id);
                                caller.type = itemdl_1.ContentType.File;
                            }
                            else {
                                //console.log("Unknown " + caller.id);
                                reject("Unknown Format in" + caller.id);
                            }
                            resolve();
                        }, function () {
                            reject(arguments[1].get_message());
                        });
                    });
                };
                DataService.prototype.getFolder = function (caller) {
                    var that = this;
                    var targetList;
                    var listItem;
                    var ctx = new SP.ClientContext(caller.parent.srcUrl);
                    //var appContextSite = new SP.AppContextSite(ctx, caller.parent.srcUrl);
                    listItem = ctx.get_web().get_lists().getByTitle(caller.parent.title).getItemById(caller.id);
                    var files = listItem.get_folder().get_files();
                    var folders = listItem.get_folder().get_folders();
                    var folder = listItem.get_folder();
                    ctx.load(listItem);
                    ctx.load(folder);
                    ctx.load(files, 'Include(ListItemAllFields)');
                    ctx.load(folders, 'Include(ListItemAllFields)');
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function () {
                            caller.name = folder.get_name();
                            for (var i = 0; i < files.get_count(); i++) {
                                caller.addToQueue(files.getItemAtIndex(i).get_listItemAllFields().get_id());
                            }
                            for (var i = 0; i < folders.get_count(); i++) {
                                caller.addToQueue(folders.getItemAtIndex(i).get_listItemAllFields().get_id());
                            }
                            caller.targetFolderURL += caller.name + "/";
                            caller.srcFolderURL += caller.name + "/";
                            resolve();
                        }, function () {
                            reject(arguments[1].get_message());
                        });
                    });
                };
                // Muss die neuen Objekte hier starten um Fehlern vorzubeugen
                DataService.prototype.copyFolder = function (caller) {
                    var targetList;
                    var listItem;
                    console.log(caller.name);
                    var ctx = new SP.ClientContext(caller.parent.targetUrl);
                    // var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl);
                    var itemCreateInfo;
                    targetList = ctx.get_web().get_lists().getByTitle(caller.parent.targetTitle);
                    var thisFolder;
                    // folderItem.
                    ctx.load(targetList);
                    if (caller.parentFolderId == null) {
                        thisFolder = targetList.get_rootFolder().get_folders().add(caller.name);
                    }
                    else {
                        thisFolder = targetList.getItemById(caller.parentFolderId).get_folder().get_folders().add(caller.name);
                    } // Überarbeiten
                    //   console.log(caller.parentFolder.get_folders());
                    ctx.load(thisFolder, "ListItemAllFields");
                    ctx.load(thisFolder);
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function () {
                            // caller.parentFolder= thisFolder;
                            caller.parentFolderId = thisFolder.get_listItemAllFields().get_id();
                            /*  var thisListItem:SP.ListItem = thisFolder.get_listItemAllFields();
                            //  thisListItem.set_item("Title",caller.name);
                              thisListItem.update();
                              ctx.load(thisListItem);
                              ctx.executeQueryAsync(
                                  function(){
                                     // console.log(thisListItem.get_item("Title"));
                                      caller.releaseQueue();
                                      resolve();
                                  },
                                  function(){
                                       reject(arguments[1].get_message());
                                  }
                              );*/
                            caller.releaseQueue();
                            resolve();
                        }, function (x, args) {
                            /*    if (args.get_errorTypeName() == "Microsoft.SharePoint.SPException" && args.get_message().includes("already exists")) {
            
                                    console.log("Already exists " + caller.id);
                                    caller.releaseQueue();
                                    resolve();
            
                                }*/
                            reject(arguments[1].get_message());
                        });
                    });
                };
                // Muss die neuen Objekte hier starten um Fehlern vorzubeugen
                DataService.prototype.copyDocSet = function (caller) {
                    var that = this;
                    var targetList;
                    var listItem;
                    var root;
                    var ctx = new SP.ClientContext(caller.parent.targetUrl);
                    // var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl);
                    targetList = ctx.get_web().get_lists().getByTitle(caller.parent.targetTitle);
                    if (caller.parentFolderId == null)
                        root = targetList.get_rootFolder();
                    else
                        root = targetList.getItemById(caller.parentFolderId).get_folder();
                    ctx.load(targetList);
                    var cTypeId = caller.contentTypeId;
                    var newCT = ctx.get_web().get_contentTypes().getById(cTypeId);
                    ctx.load(root);
                    ctx.load(newCT);
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function () {
                            SP.DocumentSet.DocumentSet.create(ctx, root, caller.name, newCT.get_id());
                            ctx.executeQueryAsync(function () {
                                that.getFolderFromDocSet(caller).then(function (response) {
                                    caller.releaseQueue();
                                    resolve();
                                }, function (response) {
                                    reject("0:" + response);
                                });
                            }, function () {
                                if (arguments[1].get_message().includes("already exists")) {
                                    that.getFolderFromDocSet(caller).then(function (response) {
                                        caller.releaseQueue();
                                        resolve();
                                    }, function (response) {
                                        reject("2:" + response);
                                    });
                                }
                                else
                                    reject("1:" + arguments[1].get_message());
                            });
                        }, function (x, args) {
                            reject("3:" + arguments[1].get_message());
                        });
                    });
                };
                DataService.prototype.getFolderFromDocSet = function (caller) {
                    var that = this;
                    var targetList;
                    var listItem;
                    var folders;
                    var ctx = new SP.ClientContext(caller.parent.targetUrl);
                    //var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl);
                    targetList = ctx.get_web().get_lists().getByTitle(caller.parent.targetTitle);
                    if (caller.parentFolderId == null)
                        folders = targetList.get_rootFolder().get_folders();
                    else
                        folders = targetList.getItemById(caller.parentFolderId).get_folder().get_folders();
                    ctx.load(targetList);
                    ctx.load(folders, 'Include(ListItemAllFields)');
                    ctx.load(folders);
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function () {
                            // console.log(folders);
                            for (var i = 0; i < folders.get_count(); i++) {
                                //    console.log(folders.getItemAtIndex(i)); 
                                if (folders.getItemAtIndex(i).get_name() == caller.name) {
                                    caller.parentFolderId = folders.getItemAtIndex(i).get_listItemAllFields().get_id();
                                    caller.targetId = folders.getItemAtIndex(i).get_listItemAllFields().get_id();
                                    resolve();
                                }
                            }
                            reject(false);
                        }, function () {
                            reject(arguments[1].get_message());
                        });
                    });
                };
                DataService.prototype.readListItem = function (caller) {
                    var that = this;
                    var ctx = new SP.ClientContext(caller.parent.srcUrl);
                    // var appContextSite = new SP.AppContextSite(ctx, caller.parent.srcUrl);
                    var hostweb = ctx.get_web();
                    var lists = hostweb.get_lists();
                    var listItem;
                    var file;
                    ctx.load(hostweb);
                    listItem = hostweb.get_lists().getByTitle(caller.parent.title).getItemById(caller.id);
                    if (caller.type == itemdl_1.ContentType.File)
                        file = listItem.get_file();
                    else
                        file = listItem.get_folder();
                    // console.log("ID "+caller.id);
                    ctx.load(listItem);
                    ctx.load(file);
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function () {
                            caller.name = file.get_name();
                            caller.srcUrl = file.get_serverRelativeUrl();
                            //  caller.title = file.get_title();
                            for (var i = 0; i < caller.parent.fields.length; i++) {
                                caller.contents.push(new fieldcontent_1.FieldContent(listItem.get_item(caller.parent.fields[i].name), caller.parent.fields[i]));
                            }
                            resolve();
                        }, function () {
                            reject(arguments[1].get_message());
                        });
                    });
                };
                DataService.prototype.fillListItem = function (caller) {
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
                                    var termValues = new SP.Taxonomy.TaxonomyFieldValueCollection(ctx, caller.contents[i].value, targets[i]);
                                    targets[i].setFieldValueByValueCollection(targetItem, termValues);
                                }
                                else if (caller.contents[i].field.type == "TaxonomyFieldType") {
                                    var termValue = new SP.Taxonomy.TaxonomyFieldValue();
                                    if (caller.contents[i].value != null) {
                                        termValue.set_label(caller.contents[i].value.get_label());
                                        termValue.set_termGuid(caller.contents[i].value.get_termGuid());
                                        termValue.set_wssId(-1);
                                        targets[i].setFieldValueByValue(targetItem, termValue);
                                    }
                                }
                                else {
                                    targetItem.set_item(caller.contents[i].field.name, caller.contents[i].value);
                                }
                            }
                            /* if(caller.type==ContentType.File){
                                 var file = targetItem.get_file();
                             file.checkIn("Copied",SP.CheckinType.majorCheckIn);
                                 ctx.load(file);
                             }*/
                            targetItem.update();
                            ctx.executeQueryAsync(function () { resolve(); }, function () { reject(arguments[1].get_message()); });
                            // console.log(targetItem);
                            // resolve();
                        }, 
                        //Fail
                        function (data) {
                            reject(arguments[1].get_message());
                        });
                    });
                };
                DataService.prototype.readFile = function (pathUrl) {
                    var executor = new SP.RequestExecutor(this.appWebUrl);
                    //var executor = new SP.RequestExecutor(pathUrl);
                    var that = this;
                    return new Promise(function (resolve, reject) {
                        executor.executeAsync({
                            url: pathUrl + "/_api/web/GetFileByServerRelativeUrl('" + pathUrl + "')/Folders",
                            //Leere Bibliotheken werden ignoriert , beheben?
                            //url: (pathUrl+"/_api/web/GetFolderByServerRelativeUrl('"+relPath+"')"),
                            method: "GET",
                            headers: { "Accept": "application/json; odata=verbose" },
                            success: function (data) {
                                var myoutput = JSON.parse((data.body.toString()));
                                var directory = [];
                                var siteResult = myoutput.d.results;
                                for (var x = 0; x < siteResult.length; x++) {
                                    directory.push(new directory_1.Directory(that.searchJSONWebApi(siteResult[x], "Name"), parent));
                                }
                                resolve(directory);
                            },
                            error: function (data) {
                                var directory = [];
                                reject(directory);
                            }
                        });
                    });
                };
                DataService.prototype.deleteEntry = function (caller) {
                    var ctx = new SP.ClientContext(caller.parent.srcUrl);
                    var srcList = ctx.get_web().get_lists().getById(caller.parent.srcListId);
                    var listItem = srcList.getItemById(caller.id);
                    ctx.load(listItem);
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function (data) {
                            listItem.deleteObject();
                            ctx.executeQueryAsync(); // why Error Bug when Last Item deleteObject outside
                            resolve();
                        }, function (data) {
                            reject(arguments[1].get_message());
                        });
                    });
                };
                DataService.prototype.buildSoapEnvelopeDelete = function (caller) {
                    var line = "";
                    line += "<?xml version= \"1.0\" encoding= \"utf-8\" ?>";
                    line += "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">";
                    line += "<soap12:Body>";
                    line += "<UpdateListItems xmlns=\"http://schemas.microsoft.com/sharepoint/soap/\">";
                    line += "<listName>" + caller.parent.title + "</listName>";
                    line += "<updates>";
                    line += "<Batch OnError=\"Continue\">";
                    line += "<Method ID=\"1\" Cmd=\"Update\">";
                    line += "<Field Name =\"ID\">" + caller.targetId + "</Field>";
                    line += "<Field Name =\"_CopySource\">\"" + caller.name + "\"</Field>";
                    line += "</Method>";
                    line += "</Batch>";
                    line += "</updates>";
                    line += "</UpdateListItems>";
                    line += "</soap12:Body>";
                    line += "</soap12:Envelope>";
                    return line;
                };
                DataService.prototype.checkCopySource = function (caller) {
                    var ctx = new SP.ClientContext(caller.parent.targetUrl);
                    // var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl).get_web();
                    var targetList = ctx.get_web().get_lists().getByTitle(caller.parent.targetTitle);
                    var targetItem = targetList.getItemById(caller.targetId);
                    // var targetField =
                    //    console.log(caller.parent.targetUrl + "/" + caller.parent.name + "/" + caller.targetFolderURL + caller.name);
                    ctx.load(targetItem);
                    ctx.executeQueryAsync(function (data) {
                        console.log(targetItem.get_item("_CopySource"));
                    }, function (data) { });
                };
                DataService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], DataService);
                return DataService;
            }());
            exports_1("DataService", DataService);
        }
    }
});
//# sourceMappingURL=dataservice.js.map