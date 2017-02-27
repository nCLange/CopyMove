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
            //import {Observable} from 'rxjs/Observable';
            //import 'rxjs/add/operator/map';
            DataService = (function () {
                function DataService() {
                    this.appWebUrl = _spPageContextInfo.webAbsoluteUrl;
                    this.searchWebUrl = this.appWebUrl;
                }
                DataService.prototype.getListPermission = function (url, title, isTitle) {
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
                        ctx.executeQueryAsync(function () {
                            // var permission = list.getUserEffectivePermissions(user.get_loginName());
                            var permission = list.get_effectiveBasePermissions();
                            resolve(permission);
                        }, function () {
                            reject(arguments[1].get_message());
                        });
                    });
                };
                DataService.prototype.getListInfoFromId = function (caller) {
                    var ctx = SP.ClientContext.get_current();
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
                            for (var i = 0; i < fieldcollection.get_count(); i++) {
                                if (!fieldcollection.itemAt(i).get_fromBaseType() && !fieldcollection.itemAt(i).get_hidden()) {
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
                    var type = "";
                    var that = this;
                    var relUrl = _spPageContextInfo.siteServerRelativeUrl.substr(1);
                    var stringindex = relUrl.indexOf("/");
                    type = relUrl.substr(stringindex + 1, 3);
                    return new Promise(function (resolve, reject) {
                        $.getScript(that.searchWebUrl + "/_layouts/15/SP.RequestExecutor.js").done(function (script, textStatus) {
                            var executor = new SP.RequestExecutor(that.appWebUrl);
                            executor.executeAsync({
                                url: that.searchWebUrl + "/_api/search/query?querytext='contentclass:sts_site'&trimduplicates=false&selectproperties'Title,Path'&rowlimit=500&sourceid='8413cd39-2156-4e00-b54d-11efd9abdb89'",
                                method: "GET",
                                headers: { "Accept": "application/json; odata=verbose" },
                                success: function (data) {
                                    var myoutput = JSON.parse((data.body.toString()));
                                    var sitecollection = [];
                                    try {
                                        var siteResult = myoutput.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
                                        for (var x = 0; x < siteResult.length; x++) {
                                            if (that.searchJSONForValue(siteResult[x].Cells.results, "Path").includes("/profile/" + type))
                                                sitecollection.push(new sitecollection_1.SiteCollection(that.searchJSONForValue(siteResult[x].Cells.results, "Title"), that.searchJSONForValue(siteResult[x].Cells.results, "Path"), caller));
                                        }
                                    }
                                    catch (err) {
                                        var sitecollection = [];
                                        reject(err);
                                    }
                                    sitecollection.sort(function (a, b) { return a.name.toLowerCase().localeCompare(b.name.toLowerCase()); });
                                    resolve(sitecollection);
                                },
                                error: function (data) {
                                    console.log(data);
                                    var sitecollection = [];
                                    reject(sitecollection);
                                }
                            });
                        });
                    });
                };
                DataService.prototype.getDocLibInfo = function (parent, pathURL, guid) {
                    var that = this;
                    var ctx = new SP.ClientContext(pathURL);
                    var list = ctx.get_web().get_lists().getById(guid);
                    var documentlibraries = [];
                    ctx.load(list);
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function () {
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
                            var doclib = new documentlibrary_1.DocumentLibrary(name, list.get_title(), list.get_entityTypeName(), parent);
                            resolve(doclib);
                        }, function (data) {
                            console.log(data);
                            reject(data);
                        });
                    });
                };
                DataService.prototype.searchDocLibFilter = function (caller, input, curProm) {
                    var type = "";
                    var that = this;
                    var relUrl = _spPageContextInfo.siteServerRelativeUrl.substr(1);
                    var stringindex = relUrl.indexOf("/");
                    type = relUrl.substr(stringindex + 1, 3);
                    // console.log(type);
                    var documentlibraries = [];
                    var siteCollections = [];
                    return new Promise(function (resolve, reject) {
                        $.getScript(that.searchWebUrl + "/_layouts/15/SP.RequestExecutor.js").done(function (script, textStatus) {
                            var executor = new SP.RequestExecutor(that.appWebUrl);
                            executor.executeAsync({
                                url: that.searchWebUrl + "/_api/search/query?querytext='Title:*" + input + "* contentclass:sts_list_documentlibrary'&trimduplicates=false&selectproperties='Title,Path,SiteName,ListID'&rowlimit=500&sourceid='8413cd39-2156-4e00-b54d-11efd9abdb89'",
                                method: "GET",
                                headers: { "Accept": "application/json; odata=verbose" },
                                success: function (data) {
                                    var myoutput = JSON.parse((data.body.toString()));
                                    var docResult = myoutput.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
                                    for (var x = 0; x < docResult.length; x++) {
                                        var checkpath = that.JSONObjectHelper(docResult[x].Cells.results, "Path");
                                        if (!checkpath.includes("/profile/" + type))
                                            continue;
                                        var siteName = that.JSONObjectHelper(docResult[x].Cells.results, "SiteName");
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
                                            siteCollections.push(new sitecollection_1.SiteCollection(siteColName, siteName, caller));
                                            siteCollections[siteCollections.length - 1].createDocLib(guid);
                                            break;
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
                };
                DataService.prototype.JSONObjectHelper = function (inputArray, key) {
                    for (var i = 0; i < inputArray.length; i++) {
                        if (inputArray[i].Key == key) {
                            return inputArray[i].Value;
                        }
                    }
                    return null;
                };
                DataService.prototype.searchDocumentLibrary3 = function (pathURL, parent) {
                    var that = this;
                    var ctx = new SP.ClientContext(pathURL);
                    var lists = ctx.get_web().get_lists();
                    var documentlibraries = [];
                    ctx.load(lists);
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function () {
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
                                        documentlibraries.push(new documentlibrary_1.DocumentLibrary(name, list.get_title(), list.get_entityTypeName(), parent));
                                }
                            }
                            documentlibraries.sort(function (a, b) { return a.title.toLowerCase().localeCompare(b.title.toLowerCase()); });
                            resolve(documentlibraries);
                        }, function (data) {
                            console.log(data);
                            reject([]);
                        });
                    });
                };
                DataService.prototype.searchDirectories = function (pathUrl, relPath, parent) {
                    var that = this;
                    return new Promise(function (resolve, reject) {
                        $.getScript(pathUrl + "/_layouts/15/SP.RequestExecutor.js").done(function (script, textStatus) {
                            var executor = new SP.RequestExecutor(that.appWebUrl);
                            executor.executeAsync({
                                url: pathUrl + "/_api/web/GetFolderByServerRelativeUrl('" + relPath + "')/Folders?$expand=ListItemAllFields",
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
                                    directory.sort(function (a, b) { return a.name.toLowerCase().localeCompare(b.name.toLowerCase()); });
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
                    line += "<DestinationUrls>";
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
                    line += "<DestinationUrls>";
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
                    var that = this;
                    var ctx = new SP.ClientContext(caller.parent.srcUrl);
                    var listItem = ctx.get_web().get_lists().getByTitle(caller.parent.title).getItemById(caller.id);
                    var cType = listItem.get_contentType();
                    ctx.load(listItem);
                    ctx.load(cType);
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function () {
                            if (listItem.get_fileSystemObjectType() == SP.FileSystemObjectType.folder) {
                                if (cType.get_id().toString().startsWith("0x0120D520")) {
                                    caller.type = itemdl_1.ContentType.DocSet;
                                    caller.contentTypeId = cType.get_id().toString().substring(0, cType.get_id().toString().length - 34);
                                    caller.contentTypeName = cType.get_name();
                                }
                                else {
                                    caller.type = itemdl_1.ContentType.Folder;
                                }
                            }
                            else if (listItem.get_fileSystemObjectType() == SP.FileSystemObjectType.file) {
                                caller.type = itemdl_1.ContentType.File;
                            }
                            else {
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
                    var ctx = new SP.ClientContext(caller.parent.srcUrl);
                    var listItem = ctx.get_web().get_lists().getByTitle(caller.parent.title).getItemById(caller.id);
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
                            caller.targetFolderURL += caller.name + "/";
                            caller.srcFolderURL += caller.name + "/";
                            for (var i = 0; i < files.get_count(); i++) {
                                // caller.parent.fileAmount++;
                                caller.addToQueue(files.getItemAtIndex(i).get_listItemAllFields().get_id());
                            }
                            for (var i = 0; i < folders.get_count(); i++) {
                                //caller.parent.fileAmount++;
                                caller.addToQueue(folders.getItemAtIndex(i).get_listItemAllFields().get_id());
                            }
                            resolve();
                        }, function () {
                            reject(arguments[1].get_message());
                        });
                    });
                };
                DataService.prototype.copyFolder = function (caller) {
                    var targetList;
                    var listItem;
                    var ctx = new SP.ClientContext(caller.parent.targetUrl);
                    var itemCreateInfo;
                    targetList = ctx.get_web().get_lists().getByTitle(caller.parent.targetTitle);
                    var thisFolder;
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
                        ctx.executeQueryAsync(function () {
                            caller.parentFolderId = thisFolder.get_listItemAllFields().get_id();
                            resolve();
                        }, function (x, args) {
                            reject(arguments[1].get_message());
                        });
                    });
                };
                DataService.prototype.copyDocSetByName = function (caller) {
                    var that = this;
                    var targetList;
                    var listItem;
                    var root;
                    var ctx = new SP.ClientContext(caller.parent.targetUrl);
                    targetList = ctx.get_web().get_lists().getByTitle(caller.parent.targetTitle);
                    if (caller.parentFolderId == null)
                        root = targetList.get_rootFolder();
                    else
                        root = targetList.getItemById(caller.parentFolderId).get_folder();
                    ctx.load(targetList);
                    var cTypeId = caller.contentTypeId;
                    var newCTs = ctx.get_web().get_contentTypes();
                    ctx.load(root);
                    ctx.load(newCTs);
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function () {
                            var newCTId = null;
                            for (var i = 0; i < newCTs.get_count(); i++) {
                                if (newCTs.getItemAtIndex(i).get_name() == caller.contentTypeName) {
                                    newCTId = newCTs.getItemAtIndex(i).get_id();
                                    break;
                                }
                            }
                            if (newCTId == null)
                                reject("Content type wasn't found in target Library");
                            SP.DocumentSet.DocumentSet.create(ctx, root, caller.name, newCTId);
                            ctx.executeQueryAsync(function () {
                                that.getFolderFromDocSet(caller).then(function (response) {
                                    // caller.releaseQueue();
                                    resolve();
                                }, function (response) {
                                    reject("0:" + response);
                                });
                            }, function () {
                                if (arguments[1].get_message().includes("already exists")) {
                                    that.getFolderFromDocSet(caller).then(function (response) {
                                        //  caller.releaseQueue();
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
                    ctx.load(listItem);
                    ctx.load(file);
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function () {
                            caller.name = file.get_name();
                            caller.srcUrl = file.get_serverRelativeUrl();
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
                            targetItem.update();
                            ctx.executeQueryAsync(function () { resolve(); }, function () { reject(arguments[1].get_message()); });
                        }, function (data) {
                            reject(arguments[1].get_message());
                        });
                    });
                };
                DataService.prototype.readFile = function (pathUrl) {
                    var executor = new SP.RequestExecutor(this.appWebUrl);
                    var that = this;
                    return new Promise(function (resolve, reject) {
                        executor.executeAsync({
                            url: pathUrl + "/_api/web/GetFileByServerRelativeUrl('" + pathUrl + "')/Folders",
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
                            ctx.executeQueryAsync(function () { resolve(); }, function () { reject(arguments[1].get_message()); });
                            // resolve();
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
                    var targetList = ctx.get_web().get_lists().getByTitle(caller.parent.targetTitle);
                    var targetItem = targetList.getItemById(caller.targetId);
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